import { useChatContext } from "../chat-context/context";
import { ThreadRender } from "./thread-render";

export const ThreadMessage = () => {
  const { chat, isLoading, error, setError, appendThreadMessage, threadId } =
    useChatContext();
  const { messages, addToolResult, handleSubmit, input, handleInputChange } =
    chat;

  return (
    <ThreadRender
      loading={isLoading}
      messages={messages}
      addToolResult={addToolResult}
      error={error ?? undefined}
    />
  );
};
