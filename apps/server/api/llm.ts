import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type LlmCreateResponse,
  type LlmDetailResponse,
  type LlmUpdateResponse,
  llmCreateRequestSchema,
  llmCreateRoute,
  llmDetailRoute,
  llmListRoute,
  llmUpdateRequestSchema,
  llmUpdateRoute,
} from "@meside/shared/api/llm.schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { llmTable } from "../db/schema/llm";
import { getLlmDtos } from "../mappers/llm";
import { getAuthOrUnauthorized } from "../utils/auth";
import { cuid } from "../utils/cuid";
import { firstOrNotCreated, firstOrNull } from "../utils/toolkit";

export const llmApi = new OpenAPIHono();

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

  const llm = firstOrNotCreated(
    await getDrizzle()
      .insert(llmTable)
      .values({
        llmId,
        name: body.name,
        provider: body.provider,
        isDefault: body.isDefault,
        ownerId: auth.userId,
        orgId: auth.orgId,
      })
      .returning(),
    "Failed to create llm",
  );

  const llmDto = await getLlmDtos([llm]);

  return c.json({ llm: llmDto[0] } as LlmCreateResponse);
});

llmApi.openapi(llmUpdateRoute, async (c) => {
  const body = llmUpdateRequestSchema.parse(await c.req.json());

  await getDrizzle()
    .update(llmTable)
    .set({
      name: body.name,
      provider: body.provider,
      isDefault: body.isDefault,
    })
    .where(eq(llmTable.llmId, body.llmId));

  return c.json({} as LlmUpdateResponse);
});
