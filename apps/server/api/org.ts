import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type OrgCreateResponse,
  type OrgDetailResponse,
  orgCreateRequestSchema,
  orgCreateRoute,
  orgDetailRoute,
  orgListRoute,
  orgUpdateRequestSchema,
  orgUpdateRoute,
} from "@meside/shared/api/org.schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { orgTable } from "../db/schema/org";
import { getOrgDtos } from "../mappers/org";
import { getAuthOrUnauthorized } from "../utils/auth";
import { cuid } from "../utils/cuid";
import { firstOrNotCreated, firstOrNull } from "../utils/toolkit";

export const orgApi = new OpenAPIHono();

orgApi.openapi(orgListRoute, async (c) => {
  const auth = getAuthOrUnauthorized(c);
  const orgs = await getDrizzle()
    .select()
    .from(orgTable)
    .where(isNull(orgTable.deletedAt))
    .orderBy(desc(orgTable.createdAt));

  const orgDtos = await getOrgDtos(orgs);
  return c.json({ orgs: orgDtos });
});

orgApi.openapi(orgDetailRoute, async (c) => {
  const { orgId } = c.req.valid("json");
  const auth = getAuthOrUnauthorized(c);

  const org = firstOrNull(
    await getDrizzle()
      .select()
      .from(orgTable)
      .where(and(eq(orgTable.orgId, orgId), isNull(orgTable.deletedAt)))
      .limit(1),
  );

  if (!org) {
    return c.json({ org: null });
  }

  const orgDtos = await getOrgDtos([org]);

  return c.json({ org: orgDtos[0] } as OrgDetailResponse);
});

orgApi.openapi(orgCreateRoute, async (c) => {
  const body = orgCreateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);
  const orgId = cuid();

  const orgs = await getDrizzle()
    .insert(orgTable)
    .values({
      orgId,
      name: body.name,
    })
    .returning();

  const org = firstOrNotCreated(orgs, "Failed to create organization");
  const orgDto = await getOrgDtos([org]);

  return c.json({ org: orgDto[0] } as OrgCreateResponse);
});

orgApi.openapi(orgUpdateRoute, async (c) => {
  const body = orgUpdateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);

  const updateValues: Partial<typeof orgTable.$inferInsert> = {};

  if (body.name) {
    updateValues.name = body.name;
  }

  await getDrizzle()
    .update(orgTable)
    .set(updateValues)
    .where(and(eq(orgTable.orgId, body.orgId), isNull(orgTable.deletedAt)));

  return c.json({});
});
