import { z } from "@hono/zod-openapi";
import type { ToolDto } from "@meside/shared/api/tool.schema";
import { getLogger } from "@meside/shared/logger/index";
import { type Tool, tool as aiTool, jsonSchema } from "ai";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";
import { and, inArray, isNull } from "drizzle-orm";
import { environment } from "../../configs/environment";
import { getDrizzle } from "../../db/db";
import { getToolDtos } from "../mapper/tool";
import { toolTable } from "../table/tool";

export type MCPClient = Awaited<ReturnType<typeof createMCPClient>>;

const logger = getLogger("tool");

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

export const getTools = async (toolIds: string[]): Promise<ToolDto[]> => {
  const tools = await getDrizzle()
    .select()
    .from(toolTable)
    .where(
      and(inArray(toolTable.toolId, toolIds), isNull(toolTable.deletedAt)),
    );

  const toolDtos = await getToolDtos(tools);

  return toolDtos;
};

export const loadTools = async (
  toolDtos: ToolDto[],
): Promise<{
  tools: Record<string, Tool>;
  mcpClients: MCPClient[];
}> => {
  const instances: {
    tools: Record<string, Tool>;
    mcpClient: MCPClient | null;
  }[] = await Promise.all(
    toolDtos.map(async (tool) => {
      if (tool.provider.provider === "http") {
        const httpTools = await loadHttpTools(tool);
        return {
          tools: httpTools,
          mcpClient: null,
        };
      }
      if (tool.provider.provider === "stdio") {
        const stdioTools = await loadStdioTools(tool);
        return stdioTools;
      }
      throw new Error("Unsupported tool provider");
    }),
  );

  const tools = instances.map((instance) => instance.tools);

  const aiTools: Record<string, Tool> = {};

  for (const tool of tools) {
    tool && Object.assign(aiTools, tool);
  }

  const mcpClients = instances
    .map((instance) => instance.mcpClient)
    .filter((mcpClient) => mcpClient !== null);

  return {
    tools: aiTools,
    mcpClients,
  };
};

export const closeMcpClients = async (mcpClients: MCPClient[]) => {
  try {
    await Promise.all(mcpClients.map((mcpClient) => mcpClient.close()));
  } catch (error) {
    logger.error("Error closing MCP clients", error);
  }
};

export const loadStdioTools = async (
  tool: ToolDto,
): Promise<{
  tools: Record<string, Tool>;
  mcpClient: MCPClient;
}> => {
  if (tool.provider.provider !== "stdio") {
    throw new Error("Tool is not a stdio tool");
  }

  const mcpClient = await createMCPClient({
    transport: new StdioMCPTransport({
      command: tool.provider.configs.command,
      args: tool.provider.configs.args,
      env: tool.provider.configs.env,
    }),
  });

  const tools = await mcpClient.tools();

  return {
    tools,
    mcpClient,
  };
};

export const loadHttpTools = async (
  tool: ToolDto,
): Promise<Record<string, Tool>> => {
  if (tool.provider.provider !== "http") {
    throw new Error("Tool is not a http tool");
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const makeFetch = async (action: string, payload: any) => {
    if (tool.provider.provider !== "http") {
      throw new Error("Tool is not a http tool");
    }
    let url = tool.provider.configs.url;
    try {
      // Check if it's a valid absolute URL
      new URL(url);
    } catch (e) {
      // If URL constructor throws, it's not a valid absolute URL
      url = new URL(url, environment.SERVER_DOMAIN).toString();
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        action,
        payload,
      }),
    });
    const data = await response.json();
    return data;
  };

  const httpTools: {
    name: string;
    description: string;
    schema: object;
  }[] = await makeFetch("tools/list", {});

  const tools: Record<string, Tool> = {};

  for (const httpTool of httpTools) {
    const toolName = convertToolName(tool.name);
    tools[`${toolName}-${httpTool.name}`] = aiTool({
      description: httpTool.description,
      parameters: jsonSchema(httpTool.schema),
      execute: async (payload) => {
        return await makeFetch(httpTool.name, payload);
      },
    });
  }

  return tools;
};

const convertToolName = (toolName: string): string => {
  // only letters, numbers, underscores and hyphens
  return toolName.replace(/[^a-zA-Z0-9_-]/g, "_");
};
