"use client";

import { useState } from "react";
import { ThreadContext } from "./context";

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [quotedThreadId, setQuotedThreadId] = useState<string | null>(null);

  return (
    <ThreadContext.Provider
      value={{
        threadId,
        setThreadId,
        quotedThreadId,
        setQuotedThreadId,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
