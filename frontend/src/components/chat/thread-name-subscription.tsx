import type { MessageListResponse } from "@/api/message.schema";
import { getNameAssistant } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
import { getThreadList } from "@/queries/thread";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { threadNameEvent } from "./thread-name-event";

export const ThreadNameSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = threadNameEvent.listen(async (payload) => {
      const { threadId } = payload;

      const query = queryClient.getQueryCache().find(
        getMessageList({
          parentThreadId: threadId,
          createdAtSort: "asc",
        })
      );

      const messagesData = query?.state?.data as
        | MessageListResponse
        | undefined;

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
        parentThreadId: threadId,
      });

      queryClient.invalidateQueries({ queryKey: [getThreadList.name] });
    });

    return () => {
      threadNameEvent.removeListener(unsubscribe);
    };
  }, [queryClient]);

  return null;
};
