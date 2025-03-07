import type { QuestionDto } from "@/api/question.schema";
import { getDrizzle } from "@/db/db";
import type { QuestionEntity } from "@/db/schema/question";
import { userTable } from "@/db/schema/user";
import { inArray } from "drizzle-orm";
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

  const [userDtos] = await Promise.all([
    getUserDtos(
      await getDrizzle()
        .select()
        .from(userTable)
        .where(inArray(userTable.userId, userIds)),
    ),
  ]);

  const questionsDto = questions.map((question) => {
    const owner = userDtos.find((user) => user.userId === question.ownerId);

    return {
      ...question,
      owner,
    } as QuestionDto;
  });

  return questionsDto;
};
