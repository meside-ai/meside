import type { MessageListResponse } from "@/api/message.schema";
import { getChatAssistant } from "@/queries/chat";
import { getChatUser } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const useSendMessage = ({
  parentThreadId,
}: {
  parentThreadId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: sendUserMessage, isPending: isSendingUserMessage } =
    useMutation(getChatUser());

  const {
    mutateAsync: getAssistantResponse,
    isPending: isGettingAssistantResponse,
  } = useMutation(getChatAssistant());

  const isLoading = useMemo(
    () => isSendingUserMessage || isGettingAssistantResponse,
    [isGettingAssistantResponse, isSendingUserMessage]
  );

  const handleMessage = useCallback(
    async (text: string) => {
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

      const assistantResponse = await getAssistantResponse({
        parentThreadId,
      });

      queryClient.setQueryData(
        getMessageList({
          parentThreadId,
          createdAtSort: "asc",
        }).queryKey,
        (prev: MessageListResponse | undefined) => {
          if (!prev) {
            return {
              messages: [assistantResponse.message],
            } as MessageListResponse;
          }

          return {
            ...prev,
            messages: [...prev.messages, assistantResponse.message],
          } as MessageListResponse;
        }
      );
    },
    [getAssistantResponse, parentThreadId, queryClient, sendUserMessage]
  );

  return {
    handleMessage,
    isLoading,
    isSendingUserMessage,
    isGettingAssistantResponse,
  };
};
