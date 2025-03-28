import { createOpenAI } from "@ai-sdk/openai";
import { z } from "@hono/zod-openapi";
import type { LlmDto } from "@meside/shared/api/llm.schema";
import { getLogger } from "@meside/shared/logger/index";
import {
  type LanguageModelV1,
  type Message,
  type Tool,
  createDataStream,
  experimental_createMCPClient as createMCPClient,
  formatDataStreamPart,
  streamText,
} from "ai";
import { and, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { getDrizzle } from "../db/db";
import { llmTable } from "../db/schema/llm";
import { getMcpToolsConfig } from "../service/tool";
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

  const activeLlm = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(llmTable)
      .where(
        and(
          eq(llmTable.orgId, auth.orgId),
          eq(llmTable.isDefault, true),
          isNull(llmTable.deletedAt),
        ),
      ),
    "Could not find default llm",
  );

  const llmModel = await getLlmModel(activeLlm);

  const mcpTools = await getMcpTools();

  const tools: Record<string, Tool> = {
    ...getInternalTools(),
    ...mcpTools,
  };

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

      const aiStream = streamText({
        model: llmModel,
        system: getSystemPrompt(),
        messages,
        tools,
        maxSteps: 10,
        temperature: 0,
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

const getSystemPrompt = () => {
  return [
    "# Background",
    "You are a helpful assistant that can help with SQL queries.",
    "# Instructions",
    "1. first get all warehouses",
    "2. If you dont know should query which warehouse, then use human-input tool to get the warehouse name",
    "3. get all tables",
    "4. get all columns in the specific table",
    "5. run query to validate the question",
    "# Output",
    "1. if validate is ok, must return the query url in the response, dont return sql query code in the response",
    "2. if validate is not ok, return the human readable error message",
    "3. final response must be the markdown format",
  ].join("\n");
};

const getInternalTools = (): Record<string, Tool> => {
  return {
    "human-input": {
      description: "Input a human readable message",
      parameters: z.object({
        askHumanMessage: z
          .string()
          .describe("Describe what information you needs human to provider"),
      }),
    },
  };
};

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
