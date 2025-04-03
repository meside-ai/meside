import { getDrizzle } from "../db/db";
import { type AgentEntity, agentTable } from "../db/schema/agent";
import { agentToolTable } from "../db/schema/agent-tool";
import { type TeamEntity, teamTable } from "../db/schema/team";
import { teamAgentTable } from "../db/schema/team-agent";
import { type ToolEntity, toolTable } from "../db/schema/tool";
import { cuid } from "../utils/cuid";

const initTeamList = (props: {
  ownerId: string;
  orgId: string;
  teamId: string;
}): TeamEntity[] => {
  const createdAt = new Date();

  return [
    {
      teamId: props.teamId,
      name: "Database Team",
      description: "Database Team",
      ownerId: props.ownerId,
      orgId: props.orgId,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      deletedAt: null,
    },
  ];
};

const initAgentList = (props: {
  ownerId: string;
  orgId: string;
  llmId: string;
}): AgentEntity[] => {
  const createdAt = new Date();

  return [
    {
      agentId: cuid(),
      name: "Data Warehouse Agent",
      description:
        "You are excel at SQL queries, data warehouse, table, column retriever",
      instructions: [
        "1. if validate is ok, must return the query url in the response, dont return sql query code in the response",
        "2. if validate is not ok, return the human readable error message",
        "3. final response must be the markdown format",
      ].join("\n"),
      llmId: props.llmId,
      ownerId: props.ownerId,
      orgId: props.orgId,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      deletedAt: null,
    },
    {
      agentId: cuid(),
      name: "Echart Software Engineer",
      description:
        "I am an expert in generating ECharts visualizations based on SQL queries. My primary function is to help users create insightful and interactive charts by processing their SQL queries. I can identify SQL query information provided in the conversation and generate corresponding ECharts, or guide users to provide the necessary details if they are missing.",
      instructions: [
        "1. If the user's message contains a SQL query or a clear reference to a SQL query (e.g., a database table, query snippet, or link to a query), I will:",
        "   - Extract the SQL query or relevant details.",
        "   - Use ECharts to generate an appropriate visualization (e.g., bar chart, line chart, pie chart) based on the query results.",
        "   - Return the chart along with a brief explanation of the visualization.",

        "2. If the user's message does not contain any SQL query or related information, I will:",
        "   - Politely inform the user that no SQL query was detected in their message.",
        "   - Ask them to specify which data warehouse or dataset they want to query.",
        "   - Avoid returning any code or chart until the necessary details are provided.",

        "My goal is to streamline the process of creating ECharts visualizations by efficiently handling SQL query inputs or guiding users to provide the required information. I aim to deliver clear, accurate, and visually appealing charts while maintaining a helpful and user-friendly interaction.",
      ].join("\n"),
      llmId: props.llmId,
      //   toolIds: [],
      ownerId: props.ownerId,
      orgId: props.orgId,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      deletedAt: null,
    },
  ];
};

const initToolList = (props: {
  toolUrl: string;
  ownerId: string;
  orgId: string;
}): ToolEntity[] => {
  const createdAt = new Date();

  return [
    {
      toolId: cuid(),
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
}) => {
  const createdAt = new Date();
  const agentList = initAgentList(props);
  const toolList = initToolList(props);
  const teamList = initTeamList(props);

  const firstAgent = agentList[0];
  const firstTool = toolList[0];
  const firstTeam = teamList[0];

  if (!firstAgent || !firstTool || !firstTeam) {
    throw new Error("Agent or Tool is not found");
  }

  await getDrizzle().insert(agentTable).values(agentList);
  await getDrizzle().insert(toolTable).values(toolList);
  await getDrizzle().insert(agentToolTable).values({
    agentToolId: cuid(),
    agentId: firstAgent.agentId,
    toolId: firstTool.toolId,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  });
  await getDrizzle().insert(teamTable).values(teamList);
  await getDrizzle().insert(teamAgentTable).values({
    teamAgentId: cuid(),
    teamId: firstTeam.teamId,
    agentId: firstAgent.agentId,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  });
};
