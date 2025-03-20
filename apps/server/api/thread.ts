import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type ThreadCreateResponse,
  type ThreadDetailResponse,
  type ThreadListResponse,
  type ThreadUpdateResponse,
  threadCreateRequestSchema,
  threadCreateRoute,
  threadDetailRequestSchema,
  threadDetailRoute,
  threadListRequestSchema,
  threadListRoute,
  threadUpdateRequestSchema,
  threadUpdateRoute,
} from "@meside/shared/api/thread.schema";
import { type SQL, and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { type ThreadEntity, threadTable } from "../db/schema/thread";
import { getThreadDtos } from "../mappers/thread";
import { getAuthOrUnauthorized } from "../utils/auth";
import { cuid } from "../utils/cuid";
import { firstOrNotCreated, firstOrNull } from "../utils/toolkit";

export const threadApi = new OpenAPIHono();

threadApi.openapi(threadListRoute, async (c) => {
  const body = threadListRequestSchema.parse(await c.req.json());

  const filter: SQL[] = [];

  filter.push(isNull(threadTable.deletedAt));
  filter.push(eq(threadTable.activeVersion, true));

  if (body.parentThreadId) {
    filter.push(eq(threadTable.parentThreadId, body.parentThreadId));
  } else if (body.parentThreadId === null) {
    filter.push(isNull(threadTable.parentThreadId));
  }

  const threads = await getDrizzle()
    .select()
    .from(threadTable)
    .where(and(...filter))
    .orderBy(desc(threadTable.createdAt));

  const threadDtos = await getThreadDtos(threads);

  return c.json({ threads: threadDtos } as ThreadListResponse);
});

threadApi.openapi(threadDetailRoute, async (c) => {
  const { threadId } = threadDetailRequestSchema.parse(await c.req.json());
  const thread = firstOrNull(
    await getDrizzle()
      .select()
      .from(threadTable)
      .where(
        and(eq(threadTable.threadId, threadId), isNull(threadTable.deletedAt)),
      )
      .limit(1),
  );

  if (!thread) {
    return c.json({ thread: null });
  }

  const threadDtos = await getThreadDtos([thread]);

  return c.json({ thread: threadDtos[0] } as ThreadDetailResponse);
});

threadApi.openapi(threadCreateRoute, async (c) => {
  const body = threadCreateRequestSchema.parse(await c.req.json());

  const auth = getAuthOrUnauthorized(c);

  let parentThread: ThreadEntity | null = null;

  if (body.parentThreadId) {
    parentThread = firstOrNull(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(eq(threadTable.threadId, body.parentThreadId)),
    );
  } else {
    parentThread = null;
  }

  const threadId = cuid();

  const thread = firstOrNotCreated(
    await getDrizzle().transaction(async (tx) => {
      await tx
        .update(threadTable)
        .set({
          activeVersion: false,
        })
        .where(
          and(
            eq(threadTable.versionId, body.versionId ?? threadId),
            eq(threadTable.activeVersion, true),
          ),
        );

      const threads = await tx
        .insert(threadTable)
        .values({
          threadId,
          versionId: body.versionId ?? threadId,
          activeVersion: true,
          shortName: body.shortName ?? undefined,
          systemPrompt: body.systemPrompt,
          userPrompt: body.userPrompt,
          messages: [],
          parentThreadId: parentThread?.threadId ?? undefined,
          ownerId: auth.userId,
          orgId: auth.orgId,
        })
        .returning();
      return threads;
    }),
    "Failed to create thread",
  );

  const threadDto = await getThreadDtos([thread]);

  return c.json({ thread: threadDto[0] } as ThreadCreateResponse);
});

threadApi.openapi(threadUpdateRoute, async (c) => {
  const body = threadUpdateRequestSchema.parse(await c.req.json());

  await getDrizzle()
    .update(threadTable)
    .set({
      shortName: body.shortName ?? undefined,
      systemPrompt: body.systemPrompt ?? undefined,
      userPrompt: body.userPrompt ?? undefined,
      messages: body.messages ?? undefined,
      parentThreadId: body.parentThreadId ?? undefined,
      status: body.status ?? undefined,
    })
    .where(eq(threadTable.threadId, body.threadId));

  return c.json({} as ThreadUpdateResponse);
});
