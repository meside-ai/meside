import { z } from "zod";
import { questionDtoSchema } from "./question.schema";

// streamQuestion
export const streamQuestionRequestSchema = z.object({
  questionId: z.string(),
  debounce: z.number().optional(),
  language: z.string().optional(),
});

export const streamQuestionResponseSchema = questionDtoSchema;

export type StreamQuestionRequest = z.infer<typeof streamQuestionRequestSchema>;
export type StreamQuestionResponse = z.infer<
  typeof streamQuestionResponseSchema
>;
