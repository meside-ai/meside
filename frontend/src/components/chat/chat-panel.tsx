import {
  type MessageDto,
  getMessageDetail,
  getMessageList,
} from "@/queries/message";
import { getThreadList } from "@/queries/thread";
import { getSystemMessage } from "@/utils/message";
import {
  Box,
  Button,
  Divider,
  Paper,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconChevronLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { MessageInput } from "../message-input/message-input";
import { MessageList } from "../message-list/message-list";
import { MessageListItem } from "../message-list/message-list-item";
import { useSendMessage } from "./use-send-message";
export type ChatPanelProps = {
  threadId: string;
  setThreadId: (threadId: string) => void;
};

export const ChatPanel = ({ threadId, setThreadId }: ChatPanelProps) => {
  const messageListResult = useQuery(
    getMessageList({
      parentThreadId: threadId,
      createdAtSort: "asc",
    })
  );

  const {
    handleMessage,
    isLoading,
    isSendingUserMessage,
    isGettingAssistantResponse,
  } = useSendMessage({
    parentThreadId: threadId,
  });

  const systemMessage = useMemo<MessageDto | null>(() => {
    const messages = messageListResult.data?.messages ?? [];
    const systemMessage = getSystemMessage(messages);
    return systemMessage;
  }, [messageListResult.data?.messages]);

  const warehouseId = useMemo(() => {
    if (!systemMessage) return null;
    if ("warehouseId" in systemMessage.structure) {
      return systemMessage.structure.warehouseId;
    }
    return null;
  }, [systemMessage]);

  return (
    <Box w="100%" h="100%" style={{ overflow: "hidden", position: "relative" }}>
      <Box h="100%" style={{ overflow: "hidden" }}>
        <ScrollArea h="100%" style={{ overflow: "hidden" }}>
          <Box mt="md" />
          {threadId && (
            <ChatParentMessage threadId={threadId} setThreadId={setThreadId} />
          )}
          {messageListResult.data && (
            <MessageList
              threadId={threadId}
              setThreadId={setThreadId}
              messages={messageListResult.data.messages}
              isGettingAssistantResponse={isGettingAssistantResponse}
              isSendingUserMessage={isSendingUserMessage}
            />
          )}
          <Box h={200} />
        </ScrollArea>
      </Box>
      <Box style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <Box px="md" pb="md">
          <Paper withBorder p="md" shadow="lg" radius="lg">
            {/* <Group mb="sm" gap="xs">
              <Button
                variant="light"
                size="xs"
                leftSection={<IconSql size={14} />}
              >
                SQL query
              </Button>
              <Button
                variant="transparent"
                size="xs"
                leftSection={<IconZoomQuestion size={14} />}
              >
                column suggestions
              </Button>
            </Group> */}
            <MessageInput
              submit={handleMessage}
              loading={isLoading}
              placeholder="Ask me anything"
              state={{
                warehouseId: warehouseId ?? undefined,
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

const ChatParentMessage = ({
  threadId,
  setThreadId,
}: {
  threadId: string;
  setThreadId: (threadId: string) => void;
}) => {
  const threadListResult = useQuery(
    getThreadList({
      threadId,
      createdAtSort: "desc",
    })
  );

  const messageDetailResult = useQuery(
    getMessageDetail({
      messageId: threadListResult.data?.threads?.[0].parentMessageId ?? "",
    })
  );

  const message = messageDetailResult.data?.message ?? null;

  if (!message) {
    return null;
  }

  return (
    <Box mx="md">
      {message.threadId && (
        <Box>
          <Button
            size="xs"
            variant="default"
            loading={messageDetailResult.isFetching}
            onClick={() => {
              setThreadId(message.threadId);
            }}
            leftSection={<IconChevronLeft size={14} />}
          >
            Back
          </Button>
          <Divider my="md" />
        </Box>
      )}

      {message ? (
        <Box>
          <MessageListItem
            message={message}
            threadId={threadId}
            setThreadId={setThreadId}
          />
          <Box display="flex" style={{ gap: "md", alignItems: "center" }}>
            <IconArrowDown size={14} />
            <Text fz="xs" fw="bold" mr="sm">
              Variant chat
            </Text>
            <Divider my="md" style={{ flex: 1 }} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Box>
      )}
    </Box>
  );
};
