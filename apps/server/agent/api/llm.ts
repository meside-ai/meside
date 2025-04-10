import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type LlmCreateResponse,
  type LlmDetailResponse,
  llmCreateRequestSchema,
  llmCreateRoute,
  llmDetailRoute,
  llmListRoute,
} from "@meside/shared/api/llm.schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import { authGuardMiddleware } from "../../middleware/guard";
import { orgGuardMiddleware } from "../../middleware/guard";
import { getAuthOrUnauthorized } from "../../utils/auth";
import { cuid } from "../../utils/cuid";
import { firstOrNotCreated, firstOrNull } from "../../utils/toolkit";
import { getLlmDtos } from "../mapper/llm";
import { llmTable } from "../table/llm";

export const llmApi = new OpenAPIHono();

llmApi.use("*", authGuardMiddleware).use("*", orgGuardMiddleware);

llmApi.openapi(llmListRoute, async (c) => {
  const llms = await getDrizzle()
    .select()
    .from(llmTable)
    .where(isNull(llmTable.deletedAt))
    .orderBy(desc(llmTable.createdAt));

  const llmDtos = await getLlmDtos(llms);
  return c.json({ llms: llmDtos });
});

llmApi.openapi(llmDetailRoute, async (c) => {
  const { llmId } = c.req.valid("json");
  const llm = firstOrNull(
    await getDrizzle()
      .select()
      .from(llmTable)
      .where(and(eq(llmTable.llmId, llmId), isNull(llmTable.deletedAt)))
      .limit(1),
  );

  if (!llm) {
    return c.json({ llm: null });
  }

  const llmDtos = await getLlmDtos([llm]);

  return c.json({ llm: llmDtos[0] } as LlmDetailResponse);
});

llmApi.openapi(llmCreateRoute, async (c) => {
  const body = llmCreateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);
  const llmId = cuid();

  const llms = await getDrizzle().transaction(async (tx) => {
    if (body.isDefault) {
      await tx
        .update(llmTable)
        .set({
          isDefault: false,
        })
        .where(eq(llmTable.orgId, auth.orgId));
    }
    const llms = await tx
      .insert(llmTable)
      .values({
        llmId,
        name: body.name,
        provider: body.provider,
        isDefault: body.isDefault,
        ownerId: auth.userId,
        orgId: auth.orgId,
      })
      .returning();

    return llms;
  });

  const llm = firstOrNotCreated(llms, "Failed to create llm");

  const llmDto = await getLlmDtos([llm]);

  return c.json({ llm: llmDto[0] } as LlmCreateResponse);
});
