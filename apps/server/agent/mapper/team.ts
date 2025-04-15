import type { TeamDto } from "@meside/shared/api/team.schema";
import type { TeamEntity } from "../table/team";

export const getTeamDtos = async (teams: TeamEntity[]): Promise<TeamDto[]> => {
  return teams.map((team) => ({
    ...team,
  }));
};
