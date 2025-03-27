import type { Message } from "@ai-sdk/ui-utils";
import { eq } from "drizzle-orm";
import { getDrizzle } from "../db/db";
import { threadTable } from "../db/schema/thread";
import { firstOrNotFound } from "../utils/toolkit";

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

  const newMessages = [...previousMessages, ...messages];

  await getDrizzle()
    .update(threadTable)
    .set({
      messages: newMessages,
    })
    .where(eq(threadTable.threadId, threadId));
};
