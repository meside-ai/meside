import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { warehouseService } from "./services/warehouse.service";

// Create the MCP server
export const server = new McpServer({
  name: "Multi-Database MCP Server",
  version: "1.0.0",
});

// Tool to list all configured warehouses
server.tool("get-warehouses", {}, async () => {
  try {
    const warehouses = await warehouseService.getWarehouses();
    const content: {
      type: "text";
      text: string;
      dbType: string;
    }[] = warehouses.map((warehouse) => ({
      type: "text",
      text: warehouse.name,
      dbType: warehouse.type,
    }));

    return {
      content,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error getting warehouses: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Tool to list all tables in a specific warehouse
server.tool(
  "get-tables",
  {
    warehouseName: z.string(),
  },
  async ({ warehouseName }) => {
    try {
      const tables = await warehouseService.getTables(warehouseName);
      const content: {
        type: "text";
        text: string;
      }[] = tables.map((table) => ({
        type: "text",
        text: `${table.schemaName}.${table.tableName}`,
      }));

      return {
        content,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting tables: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Tool to list all columns in a specific warehouse and table
server.tool(
  "get-columns",
  {
    warehouseName: z.string(),
    tableName: z.string(),
  },
  async ({ warehouseName, tableName }) => {
    try {
      const columns = await warehouseService.getColumns(
        warehouseName,
        tableName,
      );
      const content: {
        type: "text";
        text: string;
        columnDescription: string;
        foreign: string | null;
      }[] = columns.map((column) => ({
        type: "text",
        text: column.columnName,
        columnDescription: column.description ?? "",
        foreign: column.foreign ?? "",
      }));
      return {
        content,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting columns: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Tool to run a query in a specific warehouse
server.tool(
  "query",
  {
    warehouseName: z.string(),
    sql: z.string(),
  },
  async ({ warehouseName, sql }) => {
    try {
      const results = await warehouseService.runQuery(warehouseName, sql);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error running query: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);
