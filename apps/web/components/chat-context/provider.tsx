"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { useMounted } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getThreadName } from "../../queries/thread";
import { getThreadAppendMessage } from "../../queries/thread";
import { getThreadList } from "../../queries/thread";
import { getAuthToken } from "../../utils/auth-storage";
import { ChatContext, type PreviewItem } from "./context";

export const ChatProvider = ({
  threadId,
  threadMessages,
  children,
}: {
  threadId: string;
  threadMessages: Message[];
  children: React.ReactNode;
}) => {
  const params = useParams();
  const orgId = params.orgId as string;
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  const api = "/meside/server/chat/stream";

  // TODO: move appendThreadMessage to server api
  const { mutateAsync: appendThreadMessage } = useMutation({
    ...getThreadAppendMessage(),
  });

  const { mutateAsync: generateThreadName } = useMutation({
    ...getThreadName(),
    onSuccess: () => {
      queryClient.invalidateQueries(getThreadList({}));
    },
  });

  const headers = useMemo<Record<string, string>>(() => {
    const defaultHeaders: Record<string, string> = {};
    const token = getAuthToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
    if (orgId) {
      defaultHeaders["X-Org-Id"] = orgId;
    }
    return defaultHeaders;
  }, [orgId]);

  const chat = useChat({
    api,
    headers,
    body: {
      threadId,
    },
    onError: (error) => {
      console.error(error);
      setError(error);
    },
    onFinish: async (message) => {
      await appendThreadMessage({
        threadId,
        messages: [message],
      });
      await generateThreadName({
        threadId,
      });
    },
  });

  const { messages, setMessages, status, reload } = chat;

  const isLoading = useMemo(
    () => status === "submitted" || status === "streaming",
    [status],
  );

  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      setMessages(threadMessages);
    }
  }, [mounted, threadMessages, setMessages]);

  const reloadIfOnlyUserPromptCount = useRef(0);

  useEffect(() => {
    if (reloadIfOnlyUserPromptCount.current > 0) {
      return;
    }
    if (messages.length === 0) {
      return;
    }
    const onlyUserPrompt = messages.every((message) => message.role === "user");
    if (onlyUserPrompt) {
      reloadIfOnlyUserPromptCount.current++;
      reload();
    }
  }, [messages, reload]);

  const [activePreviewItem, setActivePreviewItem] =
    useState<PreviewItem | null>(null);

  return (
    <ChatContext.Provider
      value={{
        chat,
        error,
        isLoading,
        threadId,
        appendThreadMessage,
        setError,
        activePreviewItem,
        setActivePreviewItem,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
