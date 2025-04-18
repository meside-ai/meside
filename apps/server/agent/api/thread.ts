import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type ThreadAppendMessageResponse,
  type ThreadCreateResponse,
  type ThreadDetailResponse,
  type ThreadListResponse,
  type ThreadUpdateResponse,
  threadAppendMessageRoute,
  threadCreateRoute,
  threadDetailRoute,
  threadListRoute,
  threadNameRoute,
  threadUpdateRoute,
} from "@meside/shared/api/thread.schema";
import { type Message, generateObject } from "ai";
import { type SQL, and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDrizzle } from "../../db/db";
import {
  authGuardMiddleware,
  orgGuardMiddleware,
} from "../../middleware/guard";
import { getAuthOrUnauthorized } from "../../utils/auth";
import { cuid } from "../../utils/cuid";
import {
  firstOrNotCreated,
  firstOrNotFound,
  firstOrNull,
} from "../../utils/toolkit";
import { getThreadDtos } from "../mapper/thread";
import { getLlmModel } from "../service/ai";
import { getActiveLlm } from "../service/llm";
import { appendThreadMessages } from "../service/thread";
import { type ThreadEntity, threadTable } from "../table/thread";

export const threadApi = new OpenAPIHono();

threadApi.use("*", authGuardMiddleware).use("*", orgGuardMiddleware);

threadApi.openapi(threadListRoute, async (c) => {
  const body = c.req.valid("json");

  const filter: SQL[] = [];

  filter.push(isNull(threadTable.deletedAt));
  filter.push(eq(threadTable.activeVersion, true));

  if (body.parentThreadId) {
    filter.push(eq(threadTable.parentThreadId, body.parentThreadId));
  } else if (body.parentThreadId === null) {
    filter.push(isNull(threadTable.parentThreadId));
  }

  if (body.teamId) {
    filter.push(eq(threadTable.teamId, body.teamId));
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
  const { threadId } = c.req.valid("json");

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
  const body = c.req.valid("json");

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

  const messages: Message[] = [
    {
      id: cuid(),
      content: body.userPrompt,
      role: "user",
      parts: [
        {
          type: "text",
          text: body.userPrompt,
        },
      ],
    },
  ];

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
          teamId: body.teamId,
          versionId: body.versionId ?? threadId,
          activeVersion: true,
          shortName: body.shortName ?? undefined,
          systemPrompt: body.systemPrompt,
          userPrompt: body.userPrompt,
          messages,
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
  const body = c.req.valid("json");

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

threadApi.openapi(threadAppendMessageRoute, async (c) => {
  const body = c.req.valid("json");
  await appendThreadMessages(body.threadId, body.messages);
  return c.json({} as ThreadAppendMessageResponse);
});

threadApi.openapi(threadNameRoute, async (c) => {
  const { threadId } = c.req.valid("json");

  const auth = getAuthOrUnauthorized(c);
  const threads = await getDrizzle()
    .select()
    .from(threadTable)
    .where(eq(threadTable.threadId, threadId));
  const thread = firstOrNotFound(threads, "Thread not found");

  if (thread.renameCount > 2) {
    return c.json({
      threadId,
      shortName: thread.shortName,
    });
  }

  const prompt = [
    "give a question short name. word count should be between 10 and 50",
    "message history",
    JSON.stringify(thread.messages),
  ].join("\n");

  const llm = await getActiveLlm({ orgId: auth.orgId });
  const model = await getLlmModel(llm);
  const result = await generateObject({
    model,
    prompt,
    experimental_telemetry: { isEnabled: true },
    schema: z.object({
      shortName: z.string(),
    }),
  });

  const shortName = result.object.shortName.replace(/[\r\n]/g, "").trim();

  await getDrizzle()
    .update(threadTable)
    .set({
      shortName,
      renameCount: thread.renameCount + 1,
    })
    .where(eq(threadTable.threadId, threadId));

  return c.json({
    threadId,
    shortName,
  });
});
