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
