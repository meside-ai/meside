import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type TeamCreateResponse,
  type TeamDetailResponse,
  teamAgentAssignRoute,
  teamAgentListRequestSchema,
  teamAgentListRoute,
  teamAgentUnassignRoute,
  teamCreateRequestSchema,
  teamCreateRoute,
  teamDetailRoute,
  teamListRoute,
  teamUpdateRequestSchema,
  teamUpdateRoute,
} from "@meside/shared/api/team.schema";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { agentTable } from "../db/schema/agent";
import { teamTable } from "../db/schema/team";
import { teamAgentTable } from "../db/schema/team-agent";
import { getTeamDtos } from "../mappers/team";
import { getAuthOrUnauthorized } from "../utils/auth";
import { cuid } from "../utils/cuid";
import {
  firstOrNotCreated,
  firstOrNotFound,
  firstOrNull,
} from "../utils/toolkit";

export const teamApi = new OpenAPIHono();

teamApi.openapi(teamListRoute, async (c) => {
  const auth = getAuthOrUnauthorized(c);
  const teams = await getDrizzle()
    .select()
    .from(teamTable)
    .where(and(eq(teamTable.orgId, auth.orgId), isNull(teamTable.deletedAt)))
    .orderBy(desc(teamTable.createdAt));

  const teamDtos = await getTeamDtos(teams);
  return c.json({ teams: teamDtos });
});

teamApi.openapi(teamDetailRoute, async (c) => {
  const { teamId } = c.req.valid("json");
  const auth = getAuthOrUnauthorized(c);

  const team = firstOrNull(
    await getDrizzle()
      .select()
      .from(teamTable)
      .where(
        and(
          eq(teamTable.teamId, teamId),
          eq(teamTable.orgId, auth.orgId),
          isNull(teamTable.deletedAt),
        ),
      )
      .limit(1),
  );

  if (!team) {
    return c.json({ team: null });
  }

  const teamDtos = await getTeamDtos([team]);

  return c.json({ team: teamDtos[0] } as TeamDetailResponse);
});

teamApi.openapi(teamCreateRoute, async (c) => {
  const body = teamCreateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);
  const teamId = cuid();

  const teams = await getDrizzle()
    .insert(teamTable)
    .values({
      teamId,
      name: body.name,
      description: body.description,
      ownerId: auth.userId,
      orgId: auth.orgId,
    })
    .returning();

  const team = firstOrNotCreated(teams, "Failed to create team");
  const teamDto = await getTeamDtos([team]);

  return c.json({ team: teamDto[0] } as TeamCreateResponse);
});

teamApi.openapi(teamUpdateRoute, async (c) => {
  const body = teamUpdateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);

  const updateValues: Partial<typeof teamTable.$inferInsert> = {};

  if (body.name) {
    updateValues.name = body.name;
  }

  if (body.description) {
    updateValues.description = body.description;
  }

  await getDrizzle()
    .update(teamTable)
    .set(updateValues)
    .where(
      and(
        eq(teamTable.teamId, body.teamId),
        eq(teamTable.orgId, auth.orgId),
        isNull(teamTable.deletedAt),
      ),
    );

  return c.json({});
});

teamApi.openapi(teamAgentAssignRoute, async (c) => {
  const { teamId, agentIds } = c.req.valid("json");
  const auth = getAuthOrUnauthorized(c);

  // Verify team exists and belongs to user's org
  const team = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(teamTable)
      .where(
        and(
          eq(teamTable.teamId, teamId),
          eq(teamTable.orgId, auth.orgId),
          isNull(teamTable.deletedAt),
        ),
      )
      .limit(1),
    "Team not found",
  );

  // Get existing team-agent associations
  const existingTeamAgents = await getDrizzle()
    .select()
    .from(teamAgentTable)
    .where(eq(teamAgentTable.teamId, teamId));

  const existingAgentIds = existingTeamAgents.map((ta) => ta.agentId);

  // Filter out agents that are already assigned
  const newAgentIds = agentIds.filter((id) => !existingAgentIds.includes(id));

  if (newAgentIds.length > 0) {
    // Insert new team-agent associations
    await getDrizzle()
      .insert(teamAgentTable)
      .values(
        newAgentIds.map((agentId) => ({
          teamAgentId: cuid(),
          teamId,
          agentId,
        })),
      );
  }

  return c.json({});
});

teamApi.openapi(teamAgentUnassignRoute, async (c) => {
  const { teamId, agentIds } = c.req.valid("json");
  const auth = getAuthOrUnauthorized(c);

  // Verify team exists and belongs to user's org
  const team = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(teamTable)
      .where(
        and(
          eq(teamTable.teamId, teamId),
          eq(teamTable.orgId, auth.orgId),
          isNull(teamTable.deletedAt),
        ),
      )
      .limit(1),
    "Team not found",
  );

  // Remove team-agent associations
  await getDrizzle()
    .delete(teamAgentTable)
    .where(
      and(
        eq(teamAgentTable.teamId, teamId),
        inArray(teamAgentTable.agentId, agentIds),
      ),
    );

  return c.json({});
});

teamApi.openapi(teamAgentListRoute, async (c) => {
  const { teamId } = teamAgentListRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);

  // Verify team exists and belongs to user's org
  const team = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(teamTable)
      .where(
        and(
          eq(teamTable.teamId, teamId),
          eq(teamTable.orgId, auth.orgId),
          isNull(teamTable.deletedAt),
        ),
      )
      .limit(1),
    "Team not found",
  );

  // Get team-agent associations
  const teamAgents = await getDrizzle()
    .select({
      agentId: teamAgentTable.agentId,
    })
    .from(teamAgentTable)
    .where(eq(teamAgentTable.teamId, teamId));

  const agentIds = teamAgents.map((ta) => ta.agentId);

  // Get agent details
  const agents = await getDrizzle()
    .select({
      agentId: agentTable.agentId,
      name: agentTable.name,
      description: agentTable.description,
    })
    .from(agentTable)
    .where(
      and(inArray(agentTable.agentId, agentIds), isNull(agentTable.deletedAt)),
    );

  return c.json({ agents });
});
