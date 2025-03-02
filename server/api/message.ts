import { getDrizzle } from "@/db/db";
import { messageTable } from "@/db/schema/message";
import { getMessageDtos } from "@/mappers/message";
import { firstOrNull } from "@/utils/toolkit";
import { OpenAPIHono } from "@hono/zod-openapi";
import { type SQL, and, asc, desc, eq, isNull } from "drizzle-orm";
import { messageDetailRoute, messageListRoute } from "./message.schema";

export const messageApi = new OpenAPIHono()
  .openapi(messageListRoute, async (c) => {
    const body = c.req.valid("json");

    const filter: SQL[] = [];

    filter.push(isNull(messageTable.deletedAt));
    filter.push(eq(messageTable.threadId, body.parentThreadId));

    const messages = await getDrizzle()
      .select()
      .from(messageTable)
      .where(and(...filter))
      .orderBy(
        body.createdAtSort === "asc"
          ? asc(messageTable.createdAt)
          : desc(messageTable.createdAt),
      );

    const messageDtos = await getMessageDtos(messages);

    return c.json({ messages: messageDtos });
  })
  .openapi(messageDetailRoute, async (c) => {
    const { messageId } = c.req.valid("json");
    const message = firstOrNull(
      await getDrizzle()
        .select()
        .from(messageTable)
        .where(
          and(
            eq(messageTable.messageId, messageId),
            isNull(messageTable.deletedAt),
          ),
        )
        .limit(1),
    );

    if (!message) {
      return c.json({ message: null });
    }

    const messageDtos = await getMessageDtos([message]);

    return c.json({ message: messageDtos[0] });
  });

export type MessageApiType = typeof messageApi;
