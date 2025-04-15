import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type TeamCreateResponse,
  type TeamDetailResponse,
  teamCreateRequestSchema,
  teamCreateRoute,
  teamDetailRoute,
  teamListRoute,
  teamUpdateRequestSchema,
  teamUpdateRoute,
} from "@meside/shared/api/team.schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import {
  authGuardMiddleware,
  orgGuardMiddleware,
} from "../../middleware/guard";
import { getAuthOrUnauthorized } from "../../utils/auth";
import { cuid } from "../../utils/cuid";
import { firstOrNotCreated, firstOrNull } from "../../utils/toolkit";
import { getTeamDtos } from "../mapper/team";
import { teamTable } from "../table/team";

export const teamApi = new OpenAPIHono();

teamApi.use("*", authGuardMiddleware).use("*", orgGuardMiddleware);

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
      ...body,
      teamId,
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
