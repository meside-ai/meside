import { messageEntitySchema } from "@/db/schema/message";
import { z } from "zod";

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
