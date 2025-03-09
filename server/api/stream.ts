import { getDrizzle } from "@/db/db";
import { type QuestionEntity, questionTable } from "@/db/schema/question";
import { getAuth } from "@/utils/auth";
import { UnauthorizedError } from "@/utils/error";
import { firstOrNotFound } from "@/utils/toolkit";
import { getWorkflowFactory } from "@/workflows/workflow.factory";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import type { QuestionDto } from "./question.schema";
import { streamQuestionRequestSchema } from "./stream.schema";

export const streamApi = new Hono().get(
  "question",
  zValidator("query", streamQuestionRequestSchema),
  async (c) => {
    const body = c.req.valid("query");

    const authUser = getAuth(c);

    if (!authUser) {
      throw new UnauthorizedError();
    }

    const question = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(questionTable)
        .where(eq(questionTable.questionId, body.questionId)),
      "Failed to get question",
    );

    if (question.assistantContent) {
      return streamSSE(c, async (stream) => {
        await stream.writeSSE({
          data: JSON.stringify(question as QuestionDto),
        });
        await stream.writeSSE({
          data: "[DONE]",
        });
        await stream.close();
      });
    }

    const workflow = getWorkflowFactory(question);
    const aiStream = await workflow.stream({
      question,
    });

    return streamSSE(c, async (stream) => {
      const reader = aiStream.getReader();
      const initial: QuestionDto | Record<string, unknown> = {};
      let lastWriteTime = 0;
      const DEBOUNCE_INTERVAL = body.debounce;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await updateQuestionAnswer(initial as QuestionDto);
            await stream.writeSSE({
              data: JSON.stringify(initial),
            });
            await stream.writeSSE({
              data: "[DONE]",
            });
            await stream.close();
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

const updateQuestionAnswer = async (body: {
  questionId: QuestionEntity["questionId"];
  assistantContent: QuestionEntity["assistantContent"];
  assistantReason: QuestionEntity["assistantReason"];
  payload: QuestionEntity["payload"];
}): Promise<void> => {
  await getDrizzle()
    .update(questionTable)
    .set({
      assistantContent: body.assistantContent,
      assistantReason: body.assistantReason,
      payload: body.payload,
    })
    .where(eq(questionTable.questionId, body.questionId));
};
