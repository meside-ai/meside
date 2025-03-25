import type { LlmListResponse } from "@meside/shared/api/llm.schema";
import { type Tool, experimental_createMCPClient as createMCPClient } from "ai";
import { streamText } from "ai";
import { environment } from "../../../configs/environment";
import { getLlmModel } from "./llm";

let warehouseMcp: Awaited<ReturnType<typeof createMCPClient>> | null = null;

export async function POST(req: Request) {
  // TODO: use zod to validate the request
  const { messages, threadId } = await req.json();

  if (!messages || messages.length === 0) {
    return new Response("messages is required", { status: 400 });
  }

  if (!threadId) {
    return new Response("threadId is required", { status: 400 });
  }

  // TODO: move route to server, when createMCPClient and streamText are ready
  const response = await fetch(
    `${environment.SERVER_DOMAIN}/meside/server/llm/list`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  const llmList: LlmListResponse = await response.json();

  const llm = llmList.llms.find((llm) => llm.isDefault);

  if (!llm) {
    return new Response("llm is required, or you could not set default llm", {
      status: 400,
    });
  }

  const llmModel = await getLlmModel(llm);

  warehouseMcp = await createMCPClient({
    transport: {
      type: "sse",
      url: `${environment.WAREHOUSE_DOMAIN}/meside/warehouse/api/mcp/warehouse`,
    },
  });

  const warehouseTools = await warehouseMcp.tools();

  const tools: Record<string, Tool> = {
    ...warehouseTools,
  };

  const result = streamText({
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

  return result.toDataStreamResponse();
}
