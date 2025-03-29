import type { AgentDto } from "@meside/shared/api/agent.schema";
import { and, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { agentTable } from "../db/schema/agent";
import { getAgentDtos } from "../mappers/agent";
import { firstOrNotFound } from "../utils/toolkit";

export const getAgentList = async (): Promise<AgentDto[]> => {
  const agents = await getDrizzle()
    .select()
    .from(agentTable)
    .where(isNull(agentTable.deletedAt));
  return getAgentDtos(agents);
};

export const getAgentDetailByName = async (
  agentName: string,
): Promise<AgentDto> => {
  const agents = await getDrizzle()
    .select()
    .from(agentTable)
    .where(and(eq(agentTable.name, agentName), isNull(agentTable.deletedAt)))
    .limit(1);
  const agentDtos = await getAgentDtos(agents);
  const agentDto = firstOrNotFound(agentDtos, `Agent ${agentName} not found`);

  return agentDto;
};
