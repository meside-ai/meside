import { messageEntitySchema } from "@/db/schema/message";
import { z } from "zod";
import { questionDtoSchema } from "./question.schema";

// streamAssistant
export const streamAssistantRequestSchema = z.object({
  parentThreadId: z.string(),
  sseDebounce: z.number().optional().default(500),
});

export const streamAssistantResponseSchema = messageEntitySchema;

export type StreamAssistantRequest = z.infer<
  typeof streamAssistantRequestSchema
>;
export type StreamAssistantResponse = z.infer<
  typeof streamAssistantResponseSchema
>;

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
