import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { warehouseMcpToolSets } from "../../../services/warehouse-mcp";

// Create the MCP server
export const server = new McpServer({
  name: "Multi-Database MCP Server",
  version: "1.0.0",
});

for (const toolSet of warehouseMcpToolSets) {
  server.tool(
    toolSet.name,
    toolSet.description,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    toolSet.schema as any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    toolSet.execute as any,
  );
}
