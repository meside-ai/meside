import { Box } from "@mantine/core";
import { StarterPanel } from "../starter/starter-panel";
import { ChatPanel } from "./chat-panel";
import { useChatContext } from "./context";

export const MainChatPanel = () => {
  const { threadId, setThreadId } = useChatContext();

  if (!threadId) {
    return (
      <Box mx="md" pt="lg">
        <StarterPanel structureType="systemDb" setThreadId={setThreadId} />
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
