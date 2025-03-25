import { createOpenAI } from "@ai-sdk/openai";
import type { LlmDto } from "@meside/shared/api/llm.schema";
import {
  type LanguageModelV1,
  type Tool,
  createDataStream,
  experimental_createMCPClient as createMCPClient,
  streamText,
} from "ai";
import { and, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { getDrizzle } from "../db/db";
import { llmTable } from "../db/schema/llm";
import { getAuthOrUnauthorized } from "../utils/auth";
import { firstOrNotFound } from "../utils/toolkit";

export const chatApi = new Hono();

let warehouseMcp: Awaited<ReturnType<typeof createMCPClient>> | null = null;

chatApi.post("/stream", async (c) => {
  // TODO: use hono validate
  const { messages, threadId } = await c.req.json();

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

  try {
    warehouseMcp = await createMCPClient({
      transport: {
        type: "sse",
        // TODO: use database to manage mcp
        url: "http://localhost:3002/meside/warehouse/api/mcp/warehouse",
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to create warehouse mcp" }, 500);
  }

  const warehouseTools = await warehouseMcp.tools();

  const tools: Record<string, Tool> = {
    ...warehouseTools,
  };

  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      const aiStream = streamText({
        model: llmModel,
        system: [
          "# Background",
          "You are a helpful assistant that can help with SQL queries.",
          "# Instructions",
          "1. first get all warehouses, then get all tables, then get all columns in the specific table, then run query to validate the question",
          "# Output",
          "1. if validate is ok, must return the query url in the response, dont return sql query code in the response",
          "2. if validate is not ok, return the human readable error message",
          "3. final response must be the markdown format",
        ].join("\n"),
        messages,
        tools,
        maxSteps: 10,
        temperature: 0,
        experimental_telemetry: { isEnabled: true },
      });
      aiStream.mergeIntoDataStream(dataStreamWriter);
    },
    onError: (error) => {
      console.error("error", error);
      return error instanceof Error ? error.message : String(error);
    },
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");
  c.header("Content-Encoding", "none");

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
