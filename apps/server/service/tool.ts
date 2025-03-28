import { z } from "@hono/zod-openapi";
import { type Tool, tool } from "ai";

/**
 * @refactor
 * @deprecated
 * Human input tools is used to ask human to confirm to use the tool,
 * not used to ask human to provide more information.
 */
export const getHumanInputTool = (): Record<string, Tool> => {
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

/**
 * @refactor
 * @deprecated
 * Rewrite or waiting for the transport SDK for MCP protocol 2025-03-26 version
 */
export const getMcpToolsConfig = async (): Promise<
  {
    type: "sse";
    url: string;
  }[]
> => {
  return [
    {
      type: "sse",
      url: "http://localhost:3002/meside/warehouse/api/mcp/warehouse",
    },
  ];
};

/**
 * @refactor
 * temporary usages, waiting for the transport SDK for MCP protocol 2025-03-26 version
 */
export const getWarehouseTools = (
  toolSetPrefix: string,
): Record<string, Tool> => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const makeFetch = async (action: string, payload: any) => {
    const response = await fetch(
      "http://localhost:3002/meside/warehouse/api/internal",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          action,
          payload,
        }),
      },
    );
    const data = await response.json();
    return data;
  };

  return {
    [`${toolSetPrefix}-get-warehouses`]: tool({
      description: "get all data warehouses",
      parameters: z.object({}),
      execute: async (payload) => {
        return await makeFetch("get-warehouses", payload);
      },
    }),
    [`${toolSetPrefix}-get-all-columns`]: tool({
      description: "get all columns of a warehouse",
      parameters: z.object({
        warehouseName: z.string(),
      }),
      execute: async (payload) => {
        return await makeFetch("get-all-columns", payload);
      },
    }),
    [`${toolSetPrefix}-get-tables`]: tool({
      description: "get all tables of a warehouse",
      parameters: z.object({
        warehouseName: z.string(),
      }),
      execute: async (payload) => {
        return await makeFetch("get-tables", payload);
      },
    }),
    [`${toolSetPrefix}-get-columns`]: tool({
      description: "get all columns of a table",
      parameters: z.object({
        warehouseName: z.string(),
        tableName: z.string(),
      }),
      execute: async (payload) => {
        return await makeFetch("get-columns", payload);
      },
    }),
    [`${toolSetPrefix}-query`]: tool({
      description: "query a warehouse",
      parameters: z.object({
        warehouseName: z.string(),
        sql: z.string(),
      }),
      execute: async (payload) => {
        return await makeFetch("query", payload);
      },
    }),
  };
};
