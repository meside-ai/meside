import type { MessageEntity } from "@/db/schema/message";
import { z } from "zod";
import type {
  AssistantMessageStructure,
  SystemMessageStructure,
  UserMessageStructure,
} from "./message-structure";
export type GetSystemStructure = (body: {
  messages: MessageEntity[];
}) => Promise<{
  structure: SystemMessageStructure;
}>;

export type GetUserStructure = (body: {
  messages: MessageEntity[];
}) => Promise<{
  structure: UserMessageStructure;
}>;

export const llmRawSchema = z.object({
  input: z.number(),
  output: z.number(),
  model: z.string(),
  finishReason: z.string(),
});

export type LLMRaw = z.infer<typeof llmRawSchema>;

export type GetAssistantStructure = (body: {
  messages: MessageEntity[];
}) => Promise<{
  structure: AssistantMessageStructure;
  llmRaw: LLMRaw;
}>;
