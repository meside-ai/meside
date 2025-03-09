import { questionEntitySchema } from "@/db/schema/question";
import { questionPayloadSchema } from "@/questions";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { userDtoSchema } from "./user.schema";

export const questionDtoSchema = questionEntitySchema.extend({
  owner: userDtoSchema.optional(),
  siblingIds: z.array(z.string()).optional(),
});

export type QuestionDto = z.infer<typeof questionDtoSchema>;

// questionList
export const questionListRequestSchema = z.object({
  parentQuestionId: z.string().optional().nullable(),
});

export const questionListResponseSchema = z.object({
  questions: z.array(questionDtoSchema),
});

export type QuestionListRequest = z.infer<typeof questionListRequestSchema>;
export type QuestionListResponse = z.infer<typeof questionListResponseSchema>;

export const questionListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: questionListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: questionListResponseSchema,
        },
      },
      description: "Retrieve the question list",
    },
  },
});

// questionDetail
export const questionDetailRequestSchema = z.object({
  questionId: z.string(),
});

export const questionDetailResponseSchema = z.object({
  question: questionDtoSchema.nullable(),
});

export type QuestionDetailRequest = z.infer<typeof questionDetailRequestSchema>;
export type QuestionDetailResponse = z.infer<
  typeof questionDetailResponseSchema
>;

export const questionDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: questionDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: questionDetailResponseSchema,
        },
      },
      description: "Retrieve the question detail",
    },
  },
});

// questionCreate
export const questionCreateRequestSchema = z.object({
  versionId: z.string().nullable(),
  shortName: z.string().optional(),
  userContent: z.string(),
  payload: questionPayloadSchema,
  parentQuestionId: z.string().nullable(),
});

export const questionCreateResponseSchema = z.object({
  question: questionDtoSchema,
});

export type QuestionCreateRequest = z.infer<typeof questionCreateRequestSchema>;
export type QuestionCreateResponse = z.infer<
  typeof questionCreateResponseSchema
>;

export const questionCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: questionCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: questionCreateResponseSchema,
        },
      },
      description: "Create the question",
    },
  },
});

// questionSummaryName
export const questionSummaryNameRequestSchema = z.object({
  questionId: z.string(),
});

export const questionSummaryNameResponseSchema = z.object({
  shortName: z.string(),
});

export type QuestionSummaryNameRequest = z.infer<
  typeof questionSummaryNameRequestSchema
>;
export type QuestionSummaryNameResponse = z.infer<
  typeof questionSummaryNameResponseSchema
>;

export const questionSummaryNameRoute = createRoute({
  method: "post",
  path: "/name",
  request: {
    body: {
      content: {
        "application/json": {
          schema: questionSummaryNameRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: questionSummaryNameResponseSchema,
        },
      },
      description: "Create the question",
    },
  },
});
