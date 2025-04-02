"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ThreadContext } from "./context";

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const params = useParams();
  const currentThreadId =
    typeof params?.thread_id === "string" ? params.thread_id : null;

  const setThreadId = useCallback(
    (threadId: string | null) => {
      if (threadId) {
        router.push(`/chat/${threadId}`);
      } else {
        router.push("/chat");
      }
    },
    [router],
  );
  const [quotedThreadId, setQuotedThreadId] = useState<string | null>(null);

  return (
    <ThreadContext.Provider
      value={{
        threadId: currentThreadId,
        setThreadId,
        quotedThreadId,
        setQuotedThreadId,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
