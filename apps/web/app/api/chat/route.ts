import { openai } from "@ai-sdk/openai";
import { type Tool, experimental_createMCPClient as createMCPClient } from "ai";
import { streamText } from "ai";
import { environment } from "../../../configs/environment";

let warehouseMcp: Awaited<ReturnType<typeof createMCPClient>> | null = null;

export async function POST(req: Request) {
  const { messages, threadId } = await req.json();

  if (!messages || messages.length === 0) {
    return new Response("messages is required", { status: 400 });
  }

  if (!threadId) {
    return new Response("threadId is required", { status: 400 });
  }

  warehouseMcp = await createMCPClient({
    transport: {
      type: "sse",
      url: `${environment.WAREHOUSE_SERVICE_URL}/api/mcp/warehouse`,
    },
  });

  const warehouseTools = await warehouseMcp.tools();

  const tools: Record<string, Tool> = {
    ...warehouseTools,
  };

  const result = streamText({
    model: openai("gpt-4o"),
    system: [
      "# Instructions",
      "1. you excel at sql",
      "2. first get all warehouses, then get all tables, then get all columns in the specific table, then run query to validate the question",
      "3. if the question is not valid, return the error message",
      "4. if validate is ok, must return the query url in the response, dont return sql query code in the response",
      "5. final response must be the markdown format",
    ].join("\n"),
    messages,
    tools,
    maxSteps: 10,
    experimental_telemetry: { isEnabled: true },
  });

  return result.toDataStreamResponse();
}

// const createHandleFinish =
//   (threadId: string): StreamTextOnFinishCallback<any> =>
//   async (result) => {
//     await createPost<ThreadUpdateRequest, ThreadUpdateResponse>(
//       `${threadUpdateRoute.path}`
//     )({
//       threadId: threadId,
//       messages: result.response.messages,
//     });
//   };
