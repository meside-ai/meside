import { type Message, useChat } from "@ai-sdk/react";
import { ActionIcon, Box, Group, Loader, Paper, Textarea } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { getThreadAppendMessage } from "../../queries/thread";
import { ThreadRender } from "./thread-render";

export const NewThreadMessage = ({
  threadId,
  threadMessages,
}: {
  threadId: string;
  threadMessages: Message[];
}) => {
  const [error, setError] = useState<Error | null>(null);

  const api = "/meside/server/chat/stream";

  // TODO: move appendThreadMessage to server api
  const { mutateAsync: appendThreadMessage } = useMutation({
    ...getThreadAppendMessage(),
  });

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    status,
    reload,
  } = useChat({
    api,
    body: {
      threadId,
    },
    onError: (error) => {
      console.error(error);
      setError(error);
    },
    onFinish: async (message) => {
      await appendThreadMessage({
        threadId,
        messages: [message],
      });
    },
  });

  const isLoading = useMemo(
    () => status === "submitted" || status === "streaming",
    [status],
  );

  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      setMessages(threadMessages);
    }
  }, [mounted, threadMessages, setMessages]);

  const reloadIfOnlyUserPromptCount = useRef(0);

  useEffect(() => {
    if (reloadIfOnlyUserPromptCount.current > 0) {
      return;
    }
    if (messages.length === 0) {
      return;
    }
    const onlyUserPrompt = messages.every((message) => message.role === "user");
    if (onlyUserPrompt) {
      reloadIfOnlyUserPromptCount.current++;
      reload();
    }
  }, [messages, reload]);

  return (
    <Box
      display="flex"
      style={{
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Box style={{ flex: 1 }}>
        <ThreadRender
          loading={isLoading}
          messages={messages}
          addToolResult={addToolResult}
          error={error ?? undefined}
        />
      </Box>
      <Box px="md" pb="md">
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
              placeholder={"Let AI agents help you."}
              onChange={handleInputChange}
            />
            <Group justify="flex-end" gap="xs">
              <ActionIcon type="submit" size="xs">
                {isLoading ? <Loader type="dots" /> : <IconArrowUp />}
              </ActionIcon>
            </Group>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
