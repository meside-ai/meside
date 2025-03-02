import type { MessageDto } from "@/queries/message";
import { createContext } from "react";

export const MessageListContext = createContext<{
  messages: MessageDto[];
  threadId: string;
  setThreadId: (threadId: string) => void;
}>({
  messages: [],
  threadId: "",
  setThreadId: () => {},
});
