import type { UseChatHelpers } from "@ai-sdk/react";
import type { ThreadAppendMessageResponse } from "@meside/shared/api/thread.schema";
import type { ThreadAppendMessageRequest } from "@meside/shared/api/thread.schema";
import { createContext, useContext } from "react";

export type ChatContextType = {
  chat: UseChatHelpers & {
    addToolResult: ({
      toolCallId,
      result,
    }: {
      toolCallId: string;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      result: any;
    }) => void;
  };
  error: Error | null;
  isLoading: boolean;
  threadId: string;
  appendThreadMessage: (
    body: ThreadAppendMessageRequest,
  ) => Promise<ThreadAppendMessageResponse>;
  setError: (error: Error | null) => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContext");
  }
  return context;
};
