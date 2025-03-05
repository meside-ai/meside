import type { MessageListResponse } from "@/api/message.schema";
import { getChatUser } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
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

  const { stream, isLoading: isGettingAssistantResponse } =
    useAssistantStream();

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

      stream(parentThreadId, (messageChunk) => {
        console.log("Received chunk:", messageChunk);

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
  };
};
