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
import { and, desc, eq, getTableColumns, isNull } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import { authGuardMiddleware } from "../../middleware/guard";
import { cuid } from "../../utils/cuid";
import { UnauthorizedError } from "../../utils/error";
import { firstOrNotCreated, firstOrNull } from "../../utils/toolkit";
import { initApplicationData } from "../initial/initial";
import { getOrgDtos } from "../mapper/org";
import { llmTable } from "../table/llm";
import { orgTable } from "../table/org";
import { orgUserTable } from "../table/org-user";

export const orgApi = new OpenAPIHono();

orgApi.use("*", authGuardMiddleware);

orgApi.openapi(orgListRoute, async (c) => {
  const auth = c.get("auth");

  if (!auth) {
    throw new UnauthorizedError();
  }

  const orgs = await getDrizzle()
    .select(getTableColumns(orgTable))
    .from(orgTable)
    .leftJoin(orgUserTable, eq(orgTable.orgId, orgUserTable.orgId))
    .where(
      and(isNull(orgTable.deletedAt), eq(orgUserTable.userId, auth.userId)),
    )
    .orderBy(desc(orgTable.createdAt));

  const orgDtos = await getOrgDtos(orgs);
  return c.json({ orgs: orgDtos });
});

orgApi.openapi(orgDetailRoute, async (c) => {
  const { orgId } = c.req.valid("json");

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
  const orgId = cuid();
  const auth = c.get("auth");

  if (!auth) {
    throw new UnauthorizedError();
  }

  const llmId = cuid();

  const orgs = await getDrizzle().transaction(async (tx) => {
    const orgs = await tx
      .insert(orgTable)
      .values({
        orgId,
        name: body.name,
      })
      .returning();

    await tx.insert(orgUserTable).values({
      orgUserId: cuid(),
      userId: auth.userId,
      orgId,
    });

    await tx.insert(llmTable).values({
      llmId,
      name: `${body.defaultLLmProvider.model}_${cuid()}`,
      provider: body.defaultLLmProvider,
      isDefault: true,
      ownerId: auth.userId,
      orgId,
    });
    return orgs;
  });

  const org = firstOrNotCreated(orgs, "Failed to create organization");
  const orgDto = await getOrgDtos([org]);

  await initApplicationData({
    ownerId: auth.userId,
    orgId,
    toolUrl: "/meside/warehouse/internal",
    llmId,
    teamId: cuid(),
  });

  return c.json({ org: orgDto[0] } as OrgCreateResponse);
});

orgApi.openapi(orgUpdateRoute, async (c) => {
  const body = orgUpdateRequestSchema.parse(await c.req.json());
  const updateValues: Partial<typeof orgTable.$inferInsert> = {};

  if (body.name) {
    updateValues.name = body.name;
  }

  // TODO: check if user is owner of the organization

  await getDrizzle()
    .update(orgTable)
    .set(updateValues)
    .where(and(eq(orgTable.orgId, body.orgId), isNull(orgTable.deletedAt)));

  return c.json({});
});
