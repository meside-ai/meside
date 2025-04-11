import type { AgentDto } from "@meside/shared/api/agent.schema";
import { getLogger } from "@meside/shared/logger/index";
import {
  type LanguageModelV1,
  type Message,
  createDataStream,
  formatDataStreamPart,
  generateObject,
  streamText,
} from "ai";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { getDrizzle } from "../../db/db";
import { authGuardMiddleware } from "../../middleware/guard";
import { orgGuardMiddleware } from "../../middleware/guard";
import { getAuthOrUnauthorized } from "../../utils/auth";
import { firstOrNotFound } from "../../utils/toolkit";
import { getAgentDetailByName, getAgentList } from "../service/agent";
import { getLlmModel } from "../service/ai";
import { getActiveLlm } from "../service/llm";
import { getTools, loadTools } from "../service/tool";
import { llmTable } from "../table/llm";

const logger = getLogger("chat");

export const chatApi = new Hono();

chatApi.use("*", authGuardMiddleware).use("*", orgGuardMiddleware);

chatApi.post("/stream", async (c) => {
  // TODO: use hono validate
  const { messages, threadId } = (await c.req.json()) as {
    messages: Message[];
    threadId: string;
  };

  if (!messages || messages.length === 0) {
    return c.json({ error: "messages is required" }, 400);
  }

  if (!threadId) {
    return c.json({ error: "threadId is required" }, 400);
  }

  const auth = getAuthOrUnauthorized(c);

  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      const lastMessage = messages[messages.length - 1];

      if (!lastMessage) {
        throw new Error("lastMessage is required");
      }

      lastMessage.parts = await Promise.all(
        lastMessage?.parts?.map(async (part) => {
          if (part.type !== "tool-invocation") {
            return part;
          }
          const toolInvocation = part.toolInvocation;

          if (
            toolInvocation.toolName !== "human-input" ||
            toolInvocation.state !== "result"
          ) {
            return part;
          }

          const result = toolInvocation.result;

          dataStreamWriter.write(
            formatDataStreamPart("tool_result", {
              toolCallId: toolInvocation.toolCallId,
              result,
            }),
          );

          return { ...part, toolInvocation: { ...toolInvocation, result } };
        }) ?? [],
      );

      const agentName = await getAgentNameByRouterWorkflow(messages, {
        orgId: auth.orgId,
      });
      const agent = await getAgent(agentName);
      const tools = await loadAllTools(agent.toolIds);
      const agentOptions = await getAgentOptions(agent);

      const aiStream = streamText({
        ...agentOptions,
        messages,
        tools,
        experimental_telemetry: { isEnabled: true },
      });
      aiStream.mergeIntoDataStream(dataStreamWriter);
    },
    onError: (error) => {
      logger.error("error", error);
      return error instanceof Error ? error.message : String(error);
    },
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");
  c.header("Content-Encoding", "none");
  c.header("Cache-Control", "no-cache");

  return stream(c, (stream) =>
    stream.pipe(dataStream.pipeThrough(new TextEncoderStream())),
  );
});

const getAgentNameByRouterWorkflow = async (
  messages: Message[],
  context: {
    orgId: string;
  },
): Promise<string> => {
  const agentList = await getAgentList();

  const agentTextList = agentList.map((agent) => {
    return [
      `* agent name: ${agent.name}; description: ${agent.description}`,
    ].join("\n");
  });

  const systemPrompt = [
    "You are a router workflow agent, choose the best agent to handle the user request",
    "# Instructions",
    "return the agent name in the response",
    "# Here are the agents:",
    agentTextList.join("\n"),
    "# User request",
    `${JSON.stringify(messages)}`,
  ].join("\n");

  const routerLlm = await getRouterLlmModel({ orgId: context.orgId });

  const result = await generateObject({
    model: routerLlm,
    prompt: systemPrompt,
    output: "enum",
    enum: agentList.map((agent) => agent.name),
    experimental_telemetry: { isEnabled: true },
  });
  logger.info("😉 finish get agent name", result);

  const agentName = result.object;

  return agentName;
};

const getRouterLlmModel = async ({ orgId }: { orgId: string }) => {
  const activeLlm = await getActiveLlm({ orgId });
  const llmModel = await getLlmModel(activeLlm);
  return llmModel;
};

const getAgent = async (agentName: string) => {
  const agent = await getAgentDetailByName(agentName);
  return agent;
};

const getAgentOptions = async (
  agent: AgentDto,
): Promise<{
  model: LanguageModelV1;
  system: string;
  maxSteps: number;
  temperature: number;
}> => {
  const llms = await getDrizzle()
    .select()
    .from(llmTable)
    .where(eq(llmTable.llmId, agent.llmId));

  const llm = firstOrNotFound(llms, "Could not find llm");
  const llmModel = await getLlmModel(llm);

  const systemPrompt = [
    "# Background",
    agent.description,
    "# Instructions",
    agent.instructions,
  ].join("\n");

  return {
    model: llmModel,
    system: systemPrompt,
    maxSteps: 10,
    temperature: 0,
  };
};

const loadAllTools = async (toolIds: string[]) => {
  const toolDtos = await getTools(toolIds);
  const tools = await loadTools(toolDtos);
  return tools;
};
