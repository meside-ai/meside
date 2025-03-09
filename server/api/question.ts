import { getDrizzle } from "@/db/db";
import { type QuestionEntity, questionTable } from "@/db/schema/question";
import { getQuestionDtos } from "@/mappers/question";
import { getAuthOrUnauthorized } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import { BadRequestError } from "@/utils/error";
import {
  firstOrNotCreated,
  firstOrNotFound,
  firstOrNull,
} from "@/utils/toolkit";
import { getWorkflowFactory } from "@/workflows/workflow.factory";
import { OpenAPIHono } from "@hono/zod-openapi";
import { type SQL, and, desc, eq, isNull } from "drizzle-orm";
import {
  questionCreateRoute,
  questionDetailRoute,
  questionListRoute,
  questionSummaryNameRoute,
} from "./question.schema";

export const questionApi = new OpenAPIHono()
  .openapi(questionListRoute, async (c) => {
    const body = c.req.valid("json");

    const filter: SQL[] = [];

    filter.push(isNull(questionTable.deletedAt));
    filter.push(eq(questionTable.activeVersion, true));

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
  .openapi(questionDetailRoute, async (c) => {
    const { questionId } = c.req.valid("json");
    const question = firstOrNull(
      await getDrizzle()
        .select()
        .from(questionTable)
        .where(
          and(
            eq(questionTable.questionId, questionId),
            isNull(questionTable.deletedAt),
          ),
        )
        .limit(1),
    );

    if (!question) {
      return c.json({ question: null });
    }

    const questionDtos = await getQuestionDtos([question]);

    return c.json({ question: questionDtos[0] });
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
      await getDrizzle().transaction(async (tx) => {
        await tx
          .update(questionTable)
          .set({
            activeVersion: false,
          })
          .where(
            and(
              eq(questionTable.versionId, body.versionId ?? questionId),
              eq(questionTable.activeVersion, true),
            ),
          );

        const questions = await tx
          .insert(questionTable)
          .values({
            questionId,
            versionId: body.versionId ?? questionId,
            activeVersion: true,
            shortName: body.shortName ?? undefined,
            userContent: body.userContent,
            assistantReason: "",
            assistantContent: "",
            payload: body.payload,
            parentQuestionId: parentQuestion?.questionId ?? undefined,
            ownerId: auth.userId,
            orgId: auth.orgId,
          })
          .returning();
        return questions;
      }),
      "Failed to create question",
    );

    const questionDto = await getQuestionDtos([question]);

    return c.json({ question: questionDto[0] });
  })
  .openapi(questionSummaryNameRoute, async (c) => {
    const body = c.req.valid("json");

    const question = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(questionTable)
        .where(eq(questionTable.questionId, body.questionId)),
      "Question not found",
    );

    const nameQuestion: QuestionEntity = {
      ...question,
      payload: {
        type: "name",
        name: "",
        minLength: 3,
        maxLength: 20,
      },
    };

    const workflow = getWorkflowFactory(nameQuestion);
    const newQuestion = await workflow.generate({
      question: nameQuestion,
    });

    if (newQuestion.payload.type !== "name") {
      throw new BadRequestError("Invalid workflow type");
    }

    await getDrizzle()
      .update(questionTable)
      .set({
        shortName: newQuestion.payload.name,
      })
      .where(eq(questionTable.questionId, body.questionId));

    return c.json({ shortName: newQuestion.payload.name });
  });

export type QuestionApiType = typeof questionApi;
