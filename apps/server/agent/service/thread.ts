import type { Message } from "@ai-sdk/ui-utils";
import { and, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../db/db";
import { firstOrNotFound } from "../../utils/toolkit";
import { type ThreadEntity, threadTable } from "../table/thread";

export const appendThreadMessages = async (
  threadId: string,
  messages: Message[],
): Promise<void> => {
  const threads = await getDrizzle()
    .select()
    .from(threadTable)
    .where(eq(threadTable.threadId, threadId));

  const thread = firstOrNotFound(threads, "Thread not found");

  const previousMessages = thread.messages;

  if (!Array.isArray(previousMessages)) {
    throw new Error("Previous messages are not an array");
  }

  const overrideMessages = previousMessages.map((prevMsg) => {
    const matchingNewMsg = messages.find((msg) => msg.id === prevMsg.id);
    return matchingNewMsg || prevMsg;
  });

  // Append messages that don't have matching IDs
  const messagesToAppend = messages.filter(
    (msg) => !previousMessages.some((prevMsg) => prevMsg.id === msg.id),
  );

  const newMessages = [...overrideMessages, ...messagesToAppend];

  await getDrizzle()
    .update(threadTable)
    .set({
      messages: newMessages,
    })
    .where(eq(threadTable.threadId, threadId));
};

export const getThreadDetail = async (
  threadId: string,
): Promise<ThreadEntity> => {
  const threads = await getDrizzle()
    .select()
    .from(threadTable)
    .where(
      and(eq(threadTable.threadId, threadId), isNull(threadTable.deletedAt)),
    );
  const thread = firstOrNotFound(threads, "Thread not found");
  return thread;
};
