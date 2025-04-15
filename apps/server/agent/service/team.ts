import { getLogger } from "@meside/shared/logger/index";
import { type Message, generateObject } from "ai";
import { and, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import { firstOrNotFound } from "../../utils/toolkit";
import { type TeamEntity, teamTable } from "../table/team";
import { getLlmModel } from "./ai";
import { getActiveLlm } from "./llm";

const logger = getLogger("service/team");

export const getTeam = async (teamId: string): Promise<TeamEntity> => {
  const teams = await getDrizzle()
    .select()
    .from(teamTable)
    .where(and(eq(teamTable.teamId, teamId), isNull(teamTable.deletedAt)));
  return firstOrNotFound(teams, `Team ${teamId} not found`);
};

const getRouterLlmModel = async ({ orgId }: { orgId: string }) => {
  const activeLlm = await getActiveLlm({ orgId });
  const llmModel = await getLlmModel(activeLlm);
  return llmModel;
};

export const getAgentInTeam = async (
  team: TeamEntity,
  messages: Message[],
  context: {
    orgId: string;
  },
): Promise<string> => {
  const agentList = team.orchestration.agents;
  const firstAgent = firstOrNotFound(agentList, "No agents found");

  if (agentList.length === 1) {
    return firstAgent.name;
  }

  const agentTextList = agentList.map((agent) => {
    return [
      `* agent name: ${agent.name}; description: ${agent.description}`,
    ].join("\n");
  });

  const systemPrompt = [
    "You are a router workflow agent, choose the best agent to handle the user request",
    "# Instructions",
    "return the agent name in the response",
    "# Here are the agents:",
    agentTextList.join("\n"),
    "# User request",
    `${JSON.stringify(messages)}`,
  ].join("\n");

  const routerLlm = await getRouterLlmModel({ orgId: context.orgId });

  const result = await generateObject({
    model: routerLlm,
    prompt: systemPrompt,
    output: "enum",
    enum: agentList.map((agent) => agent.name),
    experimental_telemetry: { isEnabled: true },
  });
  logger.info("😉 finish get agent name", result);

  const agentName = result.object;

  return agentName;
};

export const getTeamAgent = async (team: TeamEntity, teamAgentName: string) => {
  const agent = team.orchestration.agents.find(
    (agent) => agent.name === teamAgentName,
  );
  if (!agent) {
    throw new Error(`Agent ${teamAgentName} not found in team ${team.teamId}`);
  }
  return agent;
};
