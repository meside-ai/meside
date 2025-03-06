import { getDrizzle } from "@/db/db";
import { type MessageEntity, messageTable } from "@/db/schema/message";
import { threadTable } from "@/db/schema/thread";
import { getMessageDtos } from "@/mappers/message";
import { getAuth } from "@/utils/auth";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/error";
import { getSystemMessage } from "@/utils/message";
import { firstOrNotCreated, firstOrNotFound } from "@/utils/toolkit";
import { streamSqlGeneration } from "@/workflows/sql-generation";
import { zValidator } from "@hono/zod-validator";
import { and, asc, eq, isNull } from "drizzle-orm";
import { omit } from "es-toolkit/compat";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import type { MessageDto } from "./message.schema";
import {
  type StreamAssistantResponse,
  streamAssistantRequestSchema,
} from "./stream.schema";

export const streamApi = new Hono().get(
  "assistant",
  zValidator("query", streamAssistantRequestSchema),
  async (c) => {
    const body = c.req.valid("query");

    const authUser = getAuth(c);

    if (!authUser) {
      throw new UnauthorizedError();
    }

    const parentThread = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(eq(threadTable.threadId, body.parentThreadId)),
      "Failed to get parent thread",
    );

    const messages = await getDrizzle()
      .select()
      .from(messageTable)
      .where(
        and(
          eq(messageTable.threadId, parentThread.threadId),
          isNull(messageTable.deletedAt),
        ),
      )
      .orderBy(asc(messageTable.createdAt));

    if (messages.length === 0) {
      throw new NotFoundError("No messages found");
    }

    const systemMessage = getSystemMessage(messages);

    if (!systemMessage) {
      throw new BadRequestError("No system message found");
    }

    const aiStream = await streamSqlGeneration({
      messages,
    });

    return streamSSE(c, async (stream) => {
      const reader = aiStream.getReader();
      const initial: StreamAssistantResponse | Record<string, unknown> = {};
      let lastWriteTime = 0;
      const DEBOUNCE_INTERVAL = body.sseDebounce;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            const message = await persistMessage(initial);
            Object.assign(initial, message);
            await stream.writeSSE({
              data: JSON.stringify(initial),
            });
            await stream.writeSSE({
              data: "[DONE]",
            });
            break;
          }
          Object.assign(initial, value);

          const currentTime = Date.now();
          if (currentTime - lastWriteTime >= DEBOUNCE_INTERVAL) {
            await stream.writeSSE({
              data: JSON.stringify(initial),
            });
            lastWriteTime = currentTime;
          }
        }
      } finally {
        reader.releaseLock();
      }
    });
  },
);

export type StreamApiType = typeof streamApi;

const persistMessage = async (
  rawMessage: MessageEntity | Record<string, unknown>,
): Promise<MessageDto> => {
  const messageEntity = rawMessage as MessageEntity;

  const message = firstOrNotCreated(
    await getDrizzle()
      .insert(messageTable)
      .values(omit(messageEntity, ["createdAt", "updatedAt", "deletedAt"]))
      .returning(),
    "Failed to create assistant message",
  );

  const messageDtos = await getMessageDtos([message]);

  return messageDtos[0];
};
