import type { ThreadDto } from "@meside/shared/api/thread.schema";
import { and, asc, inArray, isNull } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";
import { getDrizzle } from "../db/db";
import { type ThreadEntity, threadTable } from "../db/schema/thread";
import { userTable } from "../db/schema/user";
import { getUserDtos } from "./user";

export const getThreadDtos = async (
  threads: ThreadEntity[],
): Promise<ThreadDto[]> => {
  const userIds = uniq(
    threads
      .map((thread) => thread.ownerId)
      .filter((ownerId) => ownerId !== null),
  );
  const versionIds = uniq(
    threads.map((thread) => thread.versionId).filter(Boolean),
  );

  const [userDtos, threadSiblings] = await Promise.all([
    getUserDtos(
      await getDrizzle()
        .select()
        .from(userTable)
        .where(inArray(userTable.userId, userIds)),
    ),
    await getDrizzle()
      .select({
        threadId: threadTable.threadId,
        versionId: threadTable.versionId,
      })
      .from(threadTable)
      .where(
        and(
          inArray(threadTable.versionId, versionIds),
          isNull(threadTable.deletedAt),
        ),
      )
      .orderBy(asc(threadTable.createdAt)),
  ]);

  const threadsDto = threads.map((thread) => {
    const owner = userDtos.find((user) => user.userId === thread.ownerId);
    const siblingIds = threadSiblings
      .filter((sibling) => sibling.versionId === thread.versionId)
      .map((sibling) => sibling.threadId);

    return {
      threadId: thread.threadId,
      versionId: thread.versionId,
      activeVersion: thread.activeVersion,
      ownerId: thread.ownerId,
      orgId: thread.orgId,
      shortName: thread.shortName,
      systemPrompt: thread.systemPrompt,
      userPrompt: thread.userPrompt,
      messages: thread.messages,
      status: thread.status,
      parentThreadId: thread.parentThreadId ?? null,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      deletedAt: thread.deletedAt,
      owner,
      siblingIds,
    } as ThreadDto;
  });

  return threadsDto;
};
