import { createOpenAI } from "@ai-sdk/openai";
import type { AgentDto } from "@meside/shared/api/agent.schema";
import type { LlmDto } from "@meside/shared/api/llm.schema";
import { getLogger } from "@meside/shared/logger/index";
import {
  type LanguageModelV1,
  type LanguageModelV1Middleware,
  type LanguageModelV1StreamPart,
  type Message,
  type Tool,
  createDataStream,
  experimental_createMCPClient as createMCPClient,
  formatDataStreamPart,
  generateObject,
  streamText,
  wrapLanguageModel,
} from "ai";
import { and, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { getDrizzle } from "../db/db";
import { llmTable } from "../db/schema/llm";
import { getAgentDetail, getAgentList } from "../service/agent";
import { getMcpToolsConfig, getWarehouseTools } from "../service/tool";
import { getAuthOrUnauthorized } from "../utils/auth";
import { firstOrNotFound } from "../utils/toolkit";

const logger = getLogger("chat");

export const chatApi = new Hono();

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
      const tools = await loadTools(agent.toolIds);
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

const getLlmModel = async (llm: LlmDto): Promise<LanguageModelV1> => {
  const llmModel = await getLlmModelCore(llm);

  const wrappedLanguageModel = wrapLanguageModel({
    model: llmModel,
    middleware: [llmLoggerMiddleware],
  });

  return wrappedLanguageModel;
};

const getLlmModelCore = async (llm: LlmDto): Promise<LanguageModelV1> => {
  if (llm.provider.provider === "openai") {
    const provider = createOpenAI({
      apiKey: llm.provider.apiKey,
    });

    return provider(llm.provider.model);
  }

  if (llm.provider.provider === "deepseek") {
    const provider = createOpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: llm.provider.apiKey,
    });

    return provider(llm.provider.model);
  }

  if (llm.provider.provider === "openaiCompatible") {
    const provider = createOpenAI({
      baseURL: llm.provider.baseUrl,
      apiKey: llm.provider.apiKey,
    });

    return provider(llm.provider.model);
  }

  throw new Error("Unsupported provider");
};

const getAgentNameByRouterWorkflow = async (
  messages: Message[],
  context: {
    orgId: string;
  },
): Promise<string> => {
  const agentList = await getAgentList();

  const agentTextList = agentList.map((agent) => {
    return [
      `### agent name: ${agent.name}`,
      `* instruction: ${agent.instruction}`,
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
  });
  logger.info("😉 finish get agent name", result);

  const agentName = result.object;

  return agentName;
};

/**
 * @refactor
 * @deprecated
 * waiting for the transport SDK for MCP protocol 2025-03-26 version
 */
const getMcpTools = async () => {
  const mcpToolsConfig = await getMcpToolsConfig();

  logger.info("preparing mcpToolsConfig");
  const mcpToolsMap = await Promise.all(
    mcpToolsConfig.map(async (config) => {
      logger.info("preparing createMCPClient");
      const mcp = await createMCPClient({
        transport: config,
      });
      logger.info("prepared createMCPClient");
      logger.info("preparing mcp tools");
      return await mcp.tools();
    }),
  );

  logger.info("prepared mcpToolsMap");

  const mcpTools = mcpToolsMap.reduce(
    (acc, curr) => {
      return Object.assign(acc, curr);
    },
    {} as Record<string, Tool>,
  );

  return mcpTools;
};

const getRouterLlmModel = async ({ orgId }: { orgId: string }) => {
  const activeLlm = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(llmTable)
      .where(
        and(
          eq(llmTable.orgId, orgId),
          eq(llmTable.isDefault, true),
          isNull(llmTable.deletedAt),
        ),
      ),
    "Could not find default llm",
  );

  const llmModel = await getLlmModel(activeLlm);
  return llmModel;
};

const getAgent = async (agentName: string) => {
  const agent = await getAgentDetail(agentName);
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

  const systemPrompt = agent.instruction;

  return {
    model: llmModel,
    system: systemPrompt,
    maxSteps: 10,
    temperature: 0,
  };
};

export const llmLoggerMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    logger.info("doGenerate called");
    logger.info(`doGenerate params: ${JSON.stringify(params, null, 2)}`);
    const result = await doGenerate();

    logger.info("doGenerated finished", result);

    return result;
  },

  wrapStream: async ({ doStream, params }) => {
    logger.info("doStream called");
    logger.info(`doStream params: ${JSON.stringify(params, null, 2)}`);

    const { stream, ...rest } = await doStream();

    let generatedText = "";

    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
    >({
      transform(chunk, controller) {
        if (chunk.type === "text-delta") {
          generatedText += chunk.textDelta;
        }

        controller.enqueue(chunk);
      },

      flush() {
        logger.info("doStream finished:", generatedText);
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};

const loadTools = async (toolIds: string[]) => {
  const tools: Record<string, Tool> = {};

  await Promise.all(
    toolIds.map(async (toolId) => {
      if (toolId === "warehouse-toolset") {
        const warehouseTools = getWarehouseTools("warehouse");
        Object.assign(tools, warehouseTools);
      }
      // TODO: get tools from db
    }),
  );

  return tools;
};
