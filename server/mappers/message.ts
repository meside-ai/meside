import type { MessageDto } from "@/api/message.schema";
import { getDrizzle } from "@/db/db";
import type { MessageEntity } from "@/db/schema/message";
import { threadTable } from "@/db/schema/thread";
import { userTable } from "@/db/schema/user";
import { BadRequestError } from "@/utils/error";
import { and, asc, inArray, isNull } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";
import { getThreadDtos } from "./thread";
import { getUserDtos } from "./user";

export const getMessageDtos = async (
  messages: MessageEntity[],
): Promise<MessageDto[]> => {
  const userIds = uniq(
    messages
      .map((message) => message.ownerId)
      .filter((ownerId) => ownerId !== null),
  );
  const parentThreadIds = uniq(
    messages.map((message) => message.threadId).filter(Boolean),
  );
  const messageIds = uniq(
    messages.map((message) => message.messageId).filter(Boolean),
  );

  const [userDtos, parentThreadDtos, childThreadDtos] = await Promise.all([
    getUserDtos(
      await getDrizzle()
        .select()
        .from(userTable)
        .where(inArray(userTable.userId, userIds)),
    ),
    getThreadDtos(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(
          and(
            inArray(threadTable.threadId, parentThreadIds),
            isNull(threadTable.deletedAt),
          ),
        )
        .orderBy(asc(threadTable.createdAt)),
    ),
    getThreadDtos(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(inArray(threadTable.parentMessageId, messageIds))
        .orderBy(asc(threadTable.createdAt)),
    ),
  ]);

  const messagesDto = messages.map((message) => {
    const owner = userDtos.find((user) => user.userId === message.ownerId);
    const parentThread = parentThreadDtos.find(
      (thread) => thread.threadId === message.threadId,
    );
    const childThreads = childThreadDtos.filter(
      (thread) => thread.parentMessageId === message.messageId,
    );

    if (!parentThread) {
      throw new BadRequestError("Parent thread not found");
    }

    return {
      ...message,
      owner,
      parentThread,
      childThreads,
    } as MessageDto;
  });

  return messagesDto;
};
