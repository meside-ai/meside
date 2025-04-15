import type { TeamAgent } from "@meside/shared/api/team.schema";
import { getDrizzle } from "../../db/db";
import { cuid } from "../../utils/cuid";
import { orgUserTable } from "../table/org-user";
import { type TeamEntity, teamTable } from "../table/team";
import { type ToolEntity, toolTable } from "../table/tool";

const initTeamAgent = (props: {
  ownerId: string;
  orgId: string;
  llmId: string;
  toolIds: string[];
}): TeamAgent[] => {
  return [
    {
      llmId: props.llmId,
      toolIds: props.toolIds,
      name: "Data Warehouse Agent",
      description:
        "You are excel at SQL queries, data warehouse, table, column retriever",
      instructions: [
        "1. if validate is ok, must return the query url in the response, dont return sql query code in the response",
        "2. if validate is not ok, return the human readable error message",
        "3. final response must be the markdown format",
      ].join("\n"),
    },
  ];
};

const initTeamList = (props: {
  ownerId: string;
  orgId: string;
  teamId: string;
  llmId: string;
  toolId: string;
}): TeamEntity[] => {
  const createdAt = new Date();

  return [
    {
      teamId: props.teamId,
      name: "Database Team",
      description: "Database Team",
      ownerId: props.ownerId,
      orgId: props.orgId,
      orchestration: {
        type: "loop",
        agents: initTeamAgent({
          ownerId: props.ownerId,
          orgId: props.orgId,
          llmId: props.llmId,
          toolIds: [props.toolId],
        }),
      },
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      deletedAt: null,
    },
  ];
};

const initToolList = (props: {
  toolId: string;
  toolUrl: string;
  ownerId: string;
  orgId: string;
}): ToolEntity[] => {
  const createdAt = new Date();

  return [
    {
      toolId: props.toolId,
      name: "database",
      provider: {
        provider: "http",
        configs: { url: props.toolUrl },
      },
      ownerId: props.ownerId,
      orgId: props.orgId,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      deletedAt: null,
    },
  ];
};

export const initApplicationData = async (props: {
  ownerId: string;
  orgId: string;
  toolUrl: string;
  llmId: string;
  teamId: string;
  toolId: string;
}) => {
  const createdAt = new Date();
  const toolList = initToolList(props);
  const teamList = initTeamList(props);

  const firstTool = toolList[0];
  const firstTeam = teamList[0];

  if (!firstTool || !firstTeam) {
    throw new Error("Agent or Tool is not found");
  }

  await getDrizzle().insert(toolTable).values(toolList);
  await getDrizzle().insert(teamTable).values(teamList);
  await getDrizzle().insert(orgUserTable).values({
    orgUserId: cuid(),
    orgId: props.orgId,
    userId: props.ownerId,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  });
};
