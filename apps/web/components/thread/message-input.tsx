import { ActionIcon, Loader } from "@mantine/core";

import { Group } from "@mantine/core";

import { Textarea } from "@mantine/core";

import type { Message } from "@ai-sdk/react";
import { Paper } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useChatContext } from "../chat-context/context";
import { MessageInput as TiptapMessageInput } from "../message-input/message-input";

export const MessageInput = () => {
  return <MessageInputWithTiptap />;
};

const MessageInputWithTiptap = () => {
  const {
    chat,
    isLoading,
    setError,
    appendThreadMessage,
    threadId,
    scrollToBottom,
  } = useChatContext();
  const { input, reload, setMessages } = chat;

  const onSubmit = async (input: string) => {
    setError(null);
    const message: Message = {
      id: `msg-${nanoid()}`,
      content: input,
      role: "user",
      parts: [{ type: "text", text: input }],
    };
    await appendThreadMessage({
      threadId,
      messages: [message],
    });
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
    setMessages((prev) => [...prev, message]);
    reload();
  };

  return (
    <Paper withBorder p="md" radius="lg">
      <TiptapMessageInput
        initialValue={input}
        submit={onSubmit}
        loading={isLoading}
        placeholder="Ask a question"
      />
    </Paper>
  );
};

const MessageInputWithTextarea = () => {
  const { chat, isLoading, error, setError, appendThreadMessage, threadId } =
    useChatContext();
  const { messages, addToolResult, handleSubmit, input, handleInputChange } =
    chat;

  return (
    <Paper withBorder p="md" radius="lg">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          await appendThreadMessage({
            threadId,
            messages: [
              {
                id: `msg-${nanoid()}`,
                content: input,
                role: "user",
                parts: [{ type: "text", text: input }],
              },
            ],
          });
          handleSubmit(event);
        }}
      >
        <Textarea
          variant="unstyled"
          value={input}
          placeholder="Talking with AI teams"
          onChange={handleInputChange}
        />
        <Group justify="flex-end" gap="xs">
          <ActionIcon type="submit" size="xs">
            {isLoading ? <Loader type="dots" /> : <IconArrowUp />}
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
};
