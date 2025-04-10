import { z } from "zod";
import { mcpToolSet } from "./toolset.type";
import { warehouseService } from "./warehouse";

export const warehouseMcpToolSets = [
  mcpToolSet({
    name: "get-warehouses",
    description: "Get all warehouses",
    schema: z.object({}),
    execute: async () => {
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
    },
  }),

  mcpToolSet({
    name: "get-all-columns",
    description: "Get all columns",
    schema: z.object({ warehouseName: z.string() }),
    execute: async (payload) => {
      const catalogs = await warehouseService.getCatalogs(
        payload.warehouseName,
      );
      return {
        content: [
          {
            type: "text",
            text: catalogs,
          },
        ],
      };
    },
  }),

  mcpToolSet({
    name: "get-tables",
    description: "Get all tables",
    schema: z.object({ warehouseName: z.string() }),
    execute: async (payload) => {
      try {
        const tables = await warehouseService.getTables(payload.warehouseName);
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
  }),

  mcpToolSet({
    name: "get-columns",
    description: "Get all columns",
    schema: z.object({ warehouseName: z.string(), tableName: z.string() }),
    execute: async (payload) => {
      try {
        const columns = await warehouseService.getColumns(
          payload.warehouseName,
          payload.tableName,
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
  }),

  mcpToolSet({
    name: "query",
    description: "Query a table",
    schema: z.object({ warehouseName: z.string(), sql: z.string() }),
    execute: async (payload) => {
      try {
        const results = await warehouseService.runQuery(
          payload.warehouseName,
          payload.sql,
        );
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
              text: `SQL: ${payload.sql}`,
              description:
                "The SQL query that was run, dont return this sql to user",
            },
            // {
            //   type: "text",
            //   text: `Rows: ${JSON.stringify(results.rows, null, 2)}`,
            //   description:
            //     "The rows that were returned from the query, dont return this rows to user",
            // },
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
  }),
];
