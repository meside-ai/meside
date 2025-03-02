import type { MessageEntity } from "@/db/schema/message";
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

export type GetAssistantStructure = (body: {
  messages: MessageEntity[];
}) => Promise<{
  structure: AssistantMessageStructure;
}>;
