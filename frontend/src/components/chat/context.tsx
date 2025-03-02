import { createContext, useContext } from "react";

export type ChatContextType = {
  warehouseId: string | null;
  setWarehouseId: (warehouseId: string | null) => void;
  threadId: string | null;
  setThreadId: (threadId: string | null) => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContext");
  }
  return context;
};
