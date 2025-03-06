import type { MessageDto } from "@/queries/message";
import { Avatar, Box, Loader, Text } from "@mantine/core";
import { useContext } from "react";
import { MessageListContext } from "./message-list-context";
import { MessageListItem } from "./message-list-item";

export const MessageList = ({
  threadId,
  setThreadId,
  messages,
  isGettingAssistantResponse,
  isSendingUserMessage,
  assistantError,
}: {
  threadId: string;
  setThreadId: (threadId: string) => void;
  messages: MessageDto[];
  isGettingAssistantResponse?: boolean;
  isSendingUserMessage?: boolean;
  assistantError?: Error;
}) => {
  return (
    <MessageListContext.Provider
      value={{
        messages,
        threadId,
        setThreadId,
        isGettingAssistantResponse,
        isSendingUserMessage,
        assistantError,
      }}
    >
      <MessageListCore />
    </MessageListContext.Provider>
  );
};

const MessageListCore = () => {
  const {
    messages,
    threadId,
    setThreadId,
    isGettingAssistantResponse,
    assistantError,
  } = useContext(MessageListContext);

  return (
    <Box mx="md">
      {messages.map((message) => (
        <Box key={message.messageId}>
          <MessageListItem
            message={message}
            threadId={threadId}
            setThreadId={setThreadId}
          />
        </Box>
      ))}
      {isGettingAssistantResponse && (
        <Box display="flex" mb="lg">
          <Box mr="md">
            <Avatar size="md" radius="xl" color="blue">
              {"ASSISTANT".slice(0, 1)}
            </Avatar>
          </Box>
          <Box flex={1}>
            <Loader type="dots" />
          </Box>
        </Box>
      )}
      {assistantError && (
        <Box display="flex" mb="lg">
          <Box mr="md">
            <Avatar size="md" radius="xl" color="blue">
              {"ASSISTANT".slice(0, 1)}
            </Avatar>
          </Box>
          <Box flex={1}>
            <Text>{assistantError?.message}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
