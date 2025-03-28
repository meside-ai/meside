import zodToJsonSchema from "zod-to-json-schema";
import type { McpToolSet } from "../../../services/toolset.type";
import { warehouseMcpToolSets } from "../../../services/warehouse-mcp";

export async function POST(req: Request) {
  const json = await req.json();
  const { action, payload } = json;

  if (action === "tools/list") {
    const tools = warehouseMcpToolSets.map((toolSet) => ({
      name: toolSet.name,
      description: toolSet.description,
      schema: zodToJsonSchema(toolSet.schema),
    }));

    return new Response(JSON.stringify(tools), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  let response: Awaited<ReturnType<McpToolSet["execute"]>> | null = null;

  const toolSet = warehouseMcpToolSets.find(
    (toolSet) => toolSet.name === action,
  );

  if (!toolSet) {
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
    });
  }

  response = await toolSet.execute(payload);

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
    status: response?.isError ? 400 : 200,
  });
}
