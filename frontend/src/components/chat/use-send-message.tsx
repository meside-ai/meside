import { getChatUser } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
import type { MessageListResponse } from "@meside/api/message.schema";
import type { EditorJSONContent } from "@meside/shared/editor-json-to-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useAssistantStream } from "./use-assistant-stream";

export const useSendMessage = ({
  parentThreadId,
}: {
  parentThreadId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: sendUserMessage, isPending: isSendingUserMessage } =
    useMutation(getChatUser());

  const {
    stream,
    isLoading: isGettingAssistantResponse,
    error: assistantError,
  } = useAssistantStream();

  const isLoading = useMemo(
    () => isSendingUserMessage || isGettingAssistantResponse,
    [isGettingAssistantResponse, isSendingUserMessage]
  );

  const handleMessage = useCallback(
    async (json: EditorJSONContent) => {
      const text = JSON.stringify(json);

      const userMessage = await sendUserMessage({
        parentThreadId,
        structure: {
          type: "userContent",
          content: text,
        },
      });

      queryClient.setQueryData(
        getMessageList({
          parentThreadId,
          createdAtSort: "asc",
        }).queryKey,
        (prev: MessageListResponse | undefined) => {
          if (!prev) {
            return {
              messages: [userMessage.message],
            } as MessageListResponse;
          }

          return {
            ...prev,
            messages: [...prev.messages, userMessage.message],
          } as MessageListResponse;
        }
      );

      stream(parentThreadId, (messageChunk) => {
        queryClient.setQueryData(
          getMessageList({
            parentThreadId,
            createdAtSort: "asc",
          }).queryKey,
          (prev: MessageListResponse | undefined) => {
            if (!prev) {
              return {
                messages: [messageChunk],
              } as MessageListResponse;
            }

            const message = prev.messages.find(
              (message) => message.messageId === messageChunk.messageId
            );

            if (message) {
              return {
                ...prev,
                messages: prev.messages.map((message) =>
                  message.messageId === messageChunk.messageId
                    ? messageChunk
                    : message
                ),
              } as MessageListResponse;
            }

            return {
              ...prev,
              messages: [...prev.messages, messageChunk],
            } as MessageListResponse;
          }
        );
      });
    },
    [parentThreadId, queryClient, sendUserMessage, stream]
  );

  return {
    handleMessage,
    isLoading,
    isSendingUserMessage,
    isGettingAssistantResponse,
    assistantError,
  };
};
