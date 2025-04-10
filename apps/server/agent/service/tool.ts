import { z } from "@hono/zod-openapi";
import type { ToolDto } from "@meside/shared/api/tool.schema";
import { type Tool, tool as aiTool, jsonSchema } from "ai";
import { and, inArray, isNull } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import { getToolDtos } from "../mapper/tool";
import { toolTable } from "../table/tool";
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
): Promise<Record<string, Tool>> => {
  const aiTools: Record<string, Tool> = {};

  const connectTools = await Promise.all(
    toolDtos.map(async (tool) => {
      if (tool.provider.provider === "http") {
        const httpTools = await loadHttpTools(tool);
        return httpTools;
      }
    }),
  );

  for (const tool of connectTools) {
    tool && Object.assign(aiTools, tool);
  }

  return aiTools;
};

export const loadHttpTools = async (
  tool: ToolDto,
): Promise<Record<string, Tool>> => {
  if (tool.provider.provider !== "http") {
    throw new Error("Tool is not a http tool");
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const makeFetch = async (action: string, payload: any) => {
    const response = await fetch(tool.provider.configs.url, {
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
