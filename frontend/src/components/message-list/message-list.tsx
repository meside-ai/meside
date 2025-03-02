import type { MessageDto } from "@/queries/message";
import { Box } from "@mantine/core";
import { useContext } from "react";
import { MessageListContext } from "./message-list-context";
import { MessageListItem } from "./message-list-item";

export const MessageList = ({
  threadId,
  setThreadId,
  messages,
}: {
  threadId: string;
  setThreadId: (threadId: string) => void;
  messages: MessageDto[];
}) => {
  return (
    <MessageListContext.Provider
      value={{
        messages,
        threadId,
        setThreadId,
      }}
    >
      <MessageListCore />
    </MessageListContext.Provider>
  );
};

const MessageListCore = () => {
  const { messages, threadId, setThreadId } = useContext(MessageListContext);

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
    </Box>
  );
};
