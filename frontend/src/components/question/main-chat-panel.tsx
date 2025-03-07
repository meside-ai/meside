import { Box } from "@mantine/core";
import { ChatPanel } from "./chat-panel";
import { useQuestionContext } from "./context";
import { StartPanel } from "./start-panel";

export const MainChatPanel = () => {
  const { questionId } = useQuestionContext();

  if (!questionId) {
    return (
      <Box mx="md" pt="lg">
        <StartPanel />
      </Box>
    );
  }

  return <ChatPanel />;
};
