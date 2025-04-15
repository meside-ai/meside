import type { TeamAgent } from "@meside/shared/api/team.schema";
import { getLogger } from "@meside/shared/logger/index";
import {
  type LanguageModelV1,
  type Message,
  type Tool,
  createDataStream,
  formatDataStreamPart,
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
import { getLlmModel } from "../service/ai";
import { getAgentInTeam, getTeam, getTeamAgent } from "../service/team";
import { getThreadDetail } from "../service/thread";
import {
  type MCPClient,
  closeMcpClients,
  getTools,
  loadTools,
} from "../service/tool";
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

      const thread = await getThreadDetail(threadId);
      if (!thread.teamId) {
        throw new Error("thread.teamId is required");
      }
      const team = await getTeam(thread.teamId);
      const agentName = await getAgentInTeam(team, messages, {
        orgId: auth.orgId,
      });
      const agent = await getTeamAgent(team, agentName);
      const { tools, mcpClients } = await loadToolInstances(agent.toolIds);
      const agentOptions = await getAgentOptions(agent);

      const aiStream = streamText({
        ...agentOptions,
        messages,
        tools,
        experimental_telemetry: { isEnabled: true },
        onFinish: async () => {
          await closeMcpClients(mcpClients);
        },
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

const getAgentOptions = async (
  agent: TeamAgent,
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

const loadToolInstances = async (
  toolIds: string[],
): Promise<{
  tools: Record<string, Tool>;
  mcpClients: MCPClient[];
}> => {
  const toolDtos = await getTools(toolIds);
  const toolInstances = await loadTools(toolDtos);
  return toolInstances;
};
