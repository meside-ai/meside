import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type ToolCreateResponse,
  type ToolDetailResponse,
  toolCreateRequestSchema,
  toolCreateRoute,
  llmDetailRoute as toolDetailRoute,
  toolListRoute,
  toolUpdateRequestSchema,
  toolUpdateRoute,
} from "@meside/shared/api/tool.schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { toolTable } from "../db/schema/tool";
import { getToolDtos } from "../mappers/tool";
import { authGuardMiddleware, orgGuardMiddleware } from "../middleware/guard";
import { getAuthOrUnauthorized } from "../utils/auth";
import { cuid } from "../utils/cuid";
import { NotFoundError } from "../utils/error";
import { firstOrNotCreated, firstOrNull } from "../utils/toolkit";

export const toolApi = new OpenAPIHono();

toolApi.use("*", authGuardMiddleware).use("*", orgGuardMiddleware);

toolApi.openapi(toolListRoute, async (c) => {
  const tools = await getDrizzle()
    .select()
    .from(toolTable)
    .where(isNull(toolTable.deletedAt))
    .orderBy(desc(toolTable.createdAt));

  const toolDtos = await getToolDtos(tools);
  return c.json({ tools: toolDtos });
});

toolApi.openapi(toolDetailRoute, async (c) => {
  const { toolId } = c.req.valid("json");
  const tool = firstOrNull(
    await getDrizzle()
      .select()
      .from(toolTable)
      .where(and(eq(toolTable.toolId, toolId), isNull(toolTable.deletedAt)))
      .limit(1),
  );

  if (!tool) {
    return c.json({ tool: null });
  }

  const toolDtos = await getToolDtos([tool]);

  return c.json({ tool: toolDtos[0] } as ToolDetailResponse);
});

toolApi.openapi(toolCreateRoute, async (c) => {
  const body = toolCreateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);
  const toolId = cuid();

  const tools = await getDrizzle()
    .insert(toolTable)
    .values({
      toolId,
      name: body.name,
      provider: body.provider,
      ownerId: auth.userId,
      orgId: auth.orgId,
    })
    .returning();

  const tool = firstOrNotCreated(tools, "Failed to create tool");

  const toolDto = await getToolDtos([tool]);

  return c.json({ tool: toolDto[0] } as ToolCreateResponse);
});

toolApi.openapi(toolUpdateRoute, async (c) => {
  const body = toolUpdateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);

  const existingTool = firstOrNull(
    await getDrizzle()
      .select()
      .from(toolTable)
      .where(
        and(
          eq(toolTable.toolId, body.toolId),
          eq(toolTable.orgId, auth.orgId),
          isNull(toolTable.deletedAt),
        ),
      )
      .limit(1),
  );

  if (!existingTool) {
    throw new NotFoundError("Tool not found");
  }

  const updateValues: Record<string, unknown> = {};

  if (body.name !== undefined) {
    updateValues.name = body.name;
  }

  if (body.provider !== undefined) {
    updateValues.provider = body.provider;
  }

  await getDrizzle()
    .update(toolTable)
    .set(updateValues)
    .where(eq(toolTable.toolId, body.toolId));

  return c.json({});
});
