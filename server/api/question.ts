import { getDrizzle } from "@/db/db";
import { messageTable } from "@/db/schema/message";
import { type QuestionEntity, questionTable } from "@/db/schema/question";
import { getMessageDtos } from "@/mappers/message";
import { getQuestionDtos } from "@/mappers/question";
import { getAuthOrUnauthorized } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import { firstOrNotCreated, firstOrNull } from "@/utils/toolkit";
import { OpenAPIHono } from "@hono/zod-openapi";
import { type SQL, and, desc, eq, isNull } from "drizzle-orm";
import { messageDetailRoute } from "./message.schema";
import { questionCreateRoute, questionListRoute } from "./question.schema";

export const questionApi = new OpenAPIHono()
  .openapi(questionListRoute, async (c) => {
    const body = c.req.valid("json");

    const filter: SQL[] = [];

    filter.push(isNull(questionTable.deletedAt));

    if (body.parentQuestionId) {
      filter.push(eq(questionTable.parentQuestionId, body.parentQuestionId));
    } else if (body.parentQuestionId === null) {
      filter.push(isNull(questionTable.parentQuestionId));
    }

    const questions = await getDrizzle()
      .select()
      .from(questionTable)
      .where(and(...filter))
      .orderBy(desc(questionTable.createdAt));

    const questionDtos = await getQuestionDtos(questions);

    return c.json({ questions: questionDtos });
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
  })
  .openapi(questionCreateRoute, async (c) => {
    const body = c.req.valid("json");

    const auth = getAuthOrUnauthorized(c);

    let parentQuestion: QuestionEntity | null = null;

    if (body.parentQuestionId) {
      parentQuestion = firstOrNull(
        await getDrizzle()
          .select()
          .from(questionTable)
          .where(eq(questionTable.questionId, body.parentQuestionId)),
      );
    } else {
      parentQuestion = null;
    }

    const questionId = cuid();

    const question = firstOrNotCreated(
      await getDrizzle()
        .insert(questionTable)
        .values({
          questionId,
          versionId: body.versionId ?? questionId,
          shortName: body.shortName ?? undefined,
          userContent: body.userContent,
          payload: body.payload,
          parentQuestionId: parentQuestion?.questionId ?? undefined,
          ownerId: auth.userId,
          orgId: auth.orgId,
        })
        .returning(),
      "Failed to create question",
    );

    const questionDto = await getQuestionDtos([question]);

    return c.json({ question: questionDto[0] });
  });

export type QuestionApiType = typeof questionApi;
