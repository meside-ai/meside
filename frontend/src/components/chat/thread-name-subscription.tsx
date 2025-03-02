import type { ChatAssistantResponse } from "@/api/chat.schema";
import type { MessageListResponse } from "@/api/message.schema";
import { getChatAssistant, getNameAssistant } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
import { getThreadList } from "@/queries/thread";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const ThreadNameSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient
      .getMutationCache()
      .subscribe(async (event: any) => {
        const isChatAssistantUpdated =
          event?.action?.type === "success" &&
          event?.mutation?.options?.mutationKey?.[0] === getChatAssistant.name;

        if (!isChatAssistantUpdated) {
          return;
        }

        const data: ChatAssistantResponse = event.mutation.state.data;

        const query = queryClient.getQueryCache().find(
          getMessageList({
            parentThreadId: data.message.threadId,
            createdAtSort: "asc",
          })
        );

        const messagesData: MessageListResponse | undefined = query?.state
          ?.data as any;

        if (!messagesData) {
          return;
        }

        const assistantMessages = messagesData.messages.filter(
          (message) => message.messageRole === "ASSISTANT"
        );

        if (assistantMessages.length > 1) {
          return;
        }

        const { mutationFn } = getNameAssistant();

        if (!mutationFn) {
          return;
        }

        await mutationFn({
          parentThreadId: data.message.threadId,
        });

        queryClient.invalidateQueries({ queryKey: [getThreadList.name] });
      });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return null;
};
