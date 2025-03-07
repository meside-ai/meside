import { getChatSystem } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
import { getThreadCreate } from "@/queries/thread";
import { Button, Menu, Tooltip } from "@mantine/core";
import type {
  MessageDto,
  MessageListResponse,
} from "@meside/api/message.schema";
import { IconGraphFilled, IconMessage2Plus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useChatContext } from "../chat/context";

export const QuoteButton = ({ message }: { message: MessageDto }) => {
  const { setThreadId } = useChatContext();

  const queryClient = useQueryClient();

  const { mutateAsync: createThread, isPending: isCreatingThread } =
    useMutation(getThreadCreate());

  const { mutateAsync: sendSystemMessage, isPending: isSendingSystemMessage } =
    useMutation(getChatSystem());

  const isLoading = useMemo(
    () => isCreatingThread || isSendingSystemMessage,
    [isCreatingThread, isSendingSystemMessage]
  );

  const handleSendSystemMessage = useCallback(async () => {
    const structure = message.structure;
    if (structure.type !== "assistantDb") {
      return;
    }

    const { thread } = await createThread({
      parentMessageId: message.messageId,
      name: "New quote",
    });

    const systemMessage = await sendSystemMessage({
      parentThreadId: thread.threadId,
      structure: {
        type: "systemEcharts",
        warehouseId: structure.warehouseId,
        sql: structure.sql,
        fields: structure.fields,
      },
    });

    queryClient.setQueryData(
      getMessageList({
        parentThreadId: thread.threadId,
        createdAtSort: "asc",
      }).queryKey,
      (data: MessageListResponse | undefined) => {
        if (!data) {
          return {
            messages: [systemMessage.message],
          };
        }

        return {
          ...data,
          messages: [systemMessage.message, ...data.messages],
        };
      }
    );

    setThreadId(thread.threadId);
  }, [
    createThread,
    message.messageId,
    message.structure,
    queryClient,
    sendSystemMessage,
    setThreadId,
  ]);

  return (
    <Tooltip label="Create sub quotes to generate charts, codes or other content.">
      <Menu shadow="md" width={200} withinPortal withArrow>
        <Menu.Target>
          <Button
            leftSection={<IconMessage2Plus size={14} />}
            size="xs"
            variant="light"
            loading={isLoading}
          >
            Quote to generate further
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Variants</Menu.Label>
          <Menu.Item
            leftSection={<IconGraphFilled size={14} />}
            onClick={() => {
              handleSendSystemMessage();
            }}
          >
            generate charts
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Tooltip>
  );
};
