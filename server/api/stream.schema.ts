import { z } from "zod";
import { questionDtoSchema } from "./question.schema";

// streamQuestion
export const streamQuestionRequestSchema = z.object({
  questionId: z.string(),
  debounce: z.number().optional().default(500),
});

export const streamQuestionResponseSchema = questionDtoSchema;

export type StreamQuestionRequest = z.infer<typeof streamQuestionRequestSchema>;
export type StreamQuestionResponse = z.infer<
  typeof streamQuestionResponseSchema
>;

// streamObject
export const streamObjectRequestSchema = z.object({
  userContent: z.string(),
  assistantContent: z.string(),
  workflowType: z.enum(["name"]),
  debounce: z.number().optional().default(500),
});

export const streamObjectResponseSchema = questionDtoSchema;

export type StreamObjectRequest = z.infer<typeof streamObjectRequestSchema>;
export type StreamObjectResponse = z.infer<typeof streamObjectResponseSchema>;
