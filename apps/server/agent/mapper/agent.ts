import type { AgentDto } from "@meside/shared/api/agent.schema";
import { inArray } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import type { AgentEntity } from "../table/agent";
import { agentToolTable } from "../table/agent-tool";

export const getAgentDtos = async (
  agents: AgentEntity[],
): Promise<AgentDto[]> => {
  const tools = await getDrizzle()
    .select({
      toolId: agentToolTable.toolId,
      agentId: agentToolTable.agentId,
    })
    .from(agentToolTable)
    .where(
      inArray(
        agentToolTable.agentId,
        agents.map((agent) => agent.agentId),
      ),
    );

  const agentsDto = agents.map((agent) => {
    const toolIds = tools
      .filter((tool) => tool.agentId === agent.agentId)
      .map((tool) => tool.toolId);

    return {
      ...agent,
      toolIds,
    };
  });

  return agentsDto;
};
