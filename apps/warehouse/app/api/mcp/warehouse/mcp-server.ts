import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { warehouseMcpService } from "../../../../services/warehouse-mcp";

// Create the MCP server
export const server = new McpServer({
  name: "Multi-Database MCP Server",
  version: "1.0.0",
});

// Tool to list all configured warehouses
server.tool("get-warehouses", {}, async (payload) => {
  return warehouseMcpService.getWarehouses(payload);
});

server.tool(
  "get-all-columns",
  {
    warehouseName: z.string(),
  },
  async (payload) => {
    return warehouseMcpService.getAllColumns(payload);
  },
);

// Tool to list all tables in a specific warehouse
server.tool(
  "get-tables",
  {
    warehouseName: z.string(),
  },
  async (payload) => {
    return warehouseMcpService.getTables(payload);
  },
);

// Tool to list all columns in a specific warehouse and table
server.tool(
  "get-columns",
  {
    warehouseName: z.string(),
    tableName: z.string(),
  },
  async (payload) => {
    return warehouseMcpService.getColumns(payload);
  },
);

// Tool to run a query in a specific warehouse
server.tool(
  "query",
  {
    warehouseName: z.string(),
    sql: z.string(),
  },
  async (payload) => {
    return warehouseMcpService.query(payload);
  },
);
