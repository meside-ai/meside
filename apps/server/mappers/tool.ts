import type { ToolDto } from "@meside/shared/api/tool.schema";
import type { ToolEntity } from "../db/schema/tool";

export const getToolDtos = async (tools: ToolEntity[]): Promise<ToolDto[]> => {
  const toolsDto = tools.map((tool) => {
    return {
      ...tool,
    };
  });

  return toolsDto;
};
