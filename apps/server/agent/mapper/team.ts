import type { TeamDto } from "@meside/shared/api/team.schema";
import { inArray } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import type { TeamEntity } from "../table/team";
import { teamAgentTable } from "../table/team-agent";

export const getTeamDtos = async (teams: TeamEntity[]): Promise<TeamDto[]> => {
  const teamAgents = await getDrizzle()
    .select({
      agentId: teamAgentTable.agentId,
      teamId: teamAgentTable.teamId,
    })
    .from(teamAgentTable)
    .where(
      inArray(
        teamAgentTable.teamId,
        teams.map((team) => team.teamId),
      ),
    );

  const teamsDto = teams.map((team) => {
    const agentIds = teamAgents
      .filter((teamAgent) => teamAgent.teamId === team.teamId)
      .map((teamAgent) => teamAgent.agentId);

    return {
      ...team,
      agentIds,
    };
  });

  return teamsDto;
};
