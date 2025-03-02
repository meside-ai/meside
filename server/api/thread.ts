import { getDrizzle } from "@/db/db";
import { threadTable } from "@/db/schema/thread";
import { getThreadDtos } from "@/mappers/thread";
import { getAuth } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import { UnauthorizedError } from "@/utils/error";
import { firstOrNotCreated } from "@/utils/toolkit";
import { OpenAPIHono } from "@hono/zod-openapi";
import { eq, isNull } from "drizzle-orm";
import { and } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { asc, desc } from "drizzle-orm";
import { threadCreateRoute, threadListRoute } from "./thread.schema";

export const threadApi = new OpenAPIHono()
  .openapi(threadListRoute, async (c) => {
    const body = c.req.valid("json");

    const filter: SQL[] = [];

    filter.push(isNull(threadTable.deletedAt));

    if (body.parentMessageId) {
      filter.push(eq(threadTable.parentMessageId, body.parentMessageId));
    } else if (body.parentMessageId === null) {
      filter.push(isNull(threadTable.parentMessageId));
    }

    if (body.threadId) {
      filter.push(eq(threadTable.threadId, body.threadId));
    }

    const threads = await getDrizzle()
      .select()
      .from(threadTable)
      .where(and(...filter))
      .orderBy(
        body.createdAtSort === "asc"
          ? asc(threadTable.createdAt)
          : desc(threadTable.createdAt),
      );

    const threadsDto = await getThreadDtos(threads);
    return c.json({ threads: threadsDto });
  })
  .openapi(threadCreateRoute, async (c) => {
    const body = c.req.valid("json");
    const auth = getAuth(c);

    if (!auth) {
      throw new UnauthorizedError();
    }

    const thread = firstOrNotCreated(
      await getDrizzle()
        .insert(threadTable)
        .values({
          ...body,
          threadId: cuid(),
          ownerId: auth.orgId,
          orgId: auth.orgId,
        })
        .returning(),
      "Failed to create thread",
    );

    const threadsDto = await getThreadDtos([thread]);
    return c.json({ thread: threadsDto[0] });
  });

export type ThreadApiType = typeof threadApi;
