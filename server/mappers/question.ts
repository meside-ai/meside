import { getDrizzle } from "@/db/db";
import { type QuestionEntity, questionTable } from "@/db/schema/question";
import { userTable } from "@/db/schema/user";
import type { QuestionDto } from "@meside/shared/api/question.schema";
import { and, asc, inArray, isNull } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";
import { getUserDtos } from "./user";

export const getQuestionDtos = async (
  questions: QuestionEntity[],
): Promise<QuestionDto[]> => {
  const userIds = uniq(
    questions
      .map((question) => question.ownerId)
      .filter((ownerId) => ownerId !== null),
  );
  const versionIds = uniq(
    questions.map((question) => question.versionId).filter(Boolean),
  );

  const [userDtos, questionSiblings] = await Promise.all([
    getUserDtos(
      await getDrizzle()
        .select()
        .from(userTable)
        .where(inArray(userTable.userId, userIds)),
    ),
    await getDrizzle()
      .select({
        questionId: questionTable.questionId,
        versionId: questionTable.versionId,
      })
      .from(questionTable)
      .where(
        and(
          inArray(questionTable.versionId, versionIds),
          isNull(questionTable.deletedAt),
        ),
      )
      .orderBy(asc(questionTable.createdAt)),
  ]);

  const questionsDto = questions.map((question) => {
    const owner = userDtos.find((user) => user.userId === question.ownerId);
    const siblingIds = questionSiblings
      .filter((sibling) => sibling.versionId === question.versionId)
      .map((sibling) => sibling.questionId);

    return {
      ...question,
      owner,
      siblingIds,
    } as QuestionDto;
  });

  return questionsDto;
};
