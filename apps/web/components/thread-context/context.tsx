import { createContext, useContext } from "react";

export type ThreadContextType = {
  threadId: string | null;
  setThreadId: (threadId: string | null) => void;
  quotedThreadId: string | null;
  setQuotedThreadId: (quotedThreadId: string | null) => void;
};

export const ThreadContext = createContext<ThreadContextType | null>(null);

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreadContext must be used within a ThreadContext");
  }
  return context;
};
