import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { warehouseService } from "../../../../services/warehouse";

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
    }[] = warehouses.map((warehouse) => ({
      type: "text",
      text: [
        `warehouse name: ${warehouse.name}`,
        `warehouse type: ${warehouse.type}`,
      ]
        .filter(Boolean)
        .join("\n"),
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

server.tool(
  "get-all-columns",
  {
    warehouseName: z.string(),
  },
  async ({ warehouseName }) => {
    const catalogs = await warehouseService.getCatalogs(warehouseName);
    console.log("catalogs", catalogs);
    return {
      content: [
        {
          type: "text",
          text: catalogs,
        },
      ],
    };
  },
);

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
        text: [`table name: ${table.schemaName}.${table.tableName}`]
          .filter(Boolean)
          .join("\n"),
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
      }[] = columns.map((column) => ({
        type: "text",
        text: [
          `column name: ${column.columnName}`,
          `column type: ${column.columnType}`,
          column.foreign ? `foreign: ${column.foreign}` : null,
          column.description ? `description: ${column.description}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
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
            text: `Query URL: ${results.queryUrl}`,
            description:
              "The URL to the query results, return this url to user",
          },
          {
            type: "text",
            text: `SQL: ${sql}`,
            description:
              "The SQL query that was run, dont return this sql to user",
          },
          {
            type: "text",
            text: `Rows: ${JSON.stringify(results.rows, null, 2)}`,
            description:
              "The rows that were returned from the query, dont return this rows to user",
          },
          {
            type: "text",
            text: `Fields: ${JSON.stringify(results.fields, null, 2)}`,
            description:
              "The fields that were returned from the query, dont return this fields to user",
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
