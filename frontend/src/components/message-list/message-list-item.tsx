import type { MessageDto } from "@/queries/message";
import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageChildThreads } from "./message-child-threds";
import { MessageContent } from "./message-content";
import { QuoteButton } from "./quote-button";

export const MessageListItem = ({
  message,
  threadId,
  setThreadId,
}: {
  message: MessageDto;
  threadId: string;
  setThreadId: (threadId: string) => void;
  interactive?: boolean;
}) => {
  return (
    <Box key={message.messageId} display="flex" mb="lg">
      <Box mr="md">
        <Popover position="bottom" withArrow shadow="md" withinPortal>
          <Popover.Target>
            <Avatar
              size="md"
              radius="xl"
              color={
                message.messageRole === "ASSISTANT"
                  ? "blue"
                  : message.messageRole === "USER"
                    ? "gray"
                    : "blue"
              }
            >
              {message.messageRole.slice(0, 1)}
            </Avatar>
          </Popover.Target>
          <Popover.Dropdown>
            <Text>ID: {message.messageId}</Text>
            <Text>Role: {message.messageRole}</Text>
            <Text>Created at: {message.createdAt}</Text>
            <Text>Updated at: {message.updatedAt}</Text>
            <Text>Structure type: {message.structure.type}</Text>
          </Popover.Dropdown>
        </Popover>
      </Box>
      <Box flex={1}>
        <Box mb="xs">
          {message.messageRole === "ASSISTANT" && message.reason && (
            <Markdown remarkPlugins={[remarkGfm]}>{message.reason}</Markdown>
          )}
          <MessageContent message={message} />
        </Box>

        {message.messageRole === "ASSISTANT" && (
          <Group mb="xs" gap={0}>
            <QuoteButton message={message} />
            <Tooltip label="Good response">
              <ActionIcon variant="transparent" onClick={() => {}}>
                <IconThumbUp size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Bad response">
              <ActionIcon variant="transparent" onClick={() => {}}>
                <IconThumbDown size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}

        <MessageChildThreads
          parentMessageId={message.messageId}
          threadId={threadId}
          setThreadId={setThreadId}
        />
      </Box>
    </Box>
  );
};
