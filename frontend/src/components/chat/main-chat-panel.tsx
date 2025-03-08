import { Box } from "@mantine/core";
import { ChatPanel } from "./chat-panel";
import { useChatContext } from "./context";

export const MainChatPanel = () => {
  const { threadId, setThreadId } = useChatContext();

  if (!threadId) {
    return (
      <Box mx="md" pt="lg">
        deprecated
      </Box>
    );
  }

  return (
    <ChatPanel
      threadId={threadId}
      setThreadId={(threadId) => {
        setThreadId(threadId);
      }}
    />
  );
};
