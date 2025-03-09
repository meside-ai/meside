import { ChatPanel } from "./chat-panel";
import { useQuestionContext } from "./context";
import { StarterPanel } from "./starter-panel";

export const MainChatPanel = () => {
  const { questionId } = useQuestionContext();

  if (!questionId) {
    return <StarterPanel />;
  }

  return <ChatPanel />;
};
