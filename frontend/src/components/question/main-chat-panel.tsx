import { StarterPanel } from "../starter/starter-panel";
import { ChatPanel } from "./chat-panel";
import { useQuestionContext } from "./context";

export const MainChatPanel = () => {
  const { questionId } = useQuestionContext();

  if (!questionId) {
    return <StarterPanel />;
  }

  return <ChatPanel />;
};
