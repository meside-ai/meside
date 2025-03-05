import type { MessageDto } from "@/queries/message";
import { createContext } from "react";

export const MessageListContext = createContext<{
  messages: MessageDto[];
  threadId: string;
  setThreadId: (threadId: string) => void;
  isGettingAssistantResponse?: boolean;
  isSendingUserMessage?: boolean;
  assistantError?: Error;
}>({
  messages: [],
  threadId: "",
  setThreadId: () => {},
  isGettingAssistantResponse: false,
  isSendingUserMessage: false,
  assistantError: undefined,
});
