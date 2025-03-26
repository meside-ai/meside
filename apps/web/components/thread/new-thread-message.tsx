import { type Message, useChat } from "@ai-sdk/react";
import { ActionIcon, Box, Group, Loader, Paper, Textarea } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getThreadUpdate } from "../../queries/thread";
import { ThreadRender } from "./thread-render";

export const NewThreadMessage = ({
  threadId,
  threadMessages,
}: {
  threadId: string;
  threadMessages: Message[];
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const api = "/meside/server/chat/stream";

  const { mutateAsync: updateThread } = useMutation({
    ...getThreadUpdate(),
  });

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
  } = useChat({
    api,
    body: {
      threadId,
    },
    onResponse: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      console.error(error);
      setLoading(false);
      setError(error);
      updateThread({
        threadId,
        status: "closed",
      });
    },
    onFinish: async () => {
      if (messages.length > 0) {
        updateThread({
          threadId,
          status: "closed",
          messages,
        });
      }
      setLoading(false);
    },
  });

  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      setMessages(threadMessages);
    }
  }, [mounted, threadMessages, setMessages]);

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
          loading={loading}
          messages={messages}
          addToolResult={addToolResult}
          error={error ?? undefined}
        />
      </Box>
      <Box px="md" pb="md">
        <Paper withBorder p="md" radius="lg">
          <form
            onSubmit={(event) => {
              setLoading(true);
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
                {loading ? <Loader type="dots" /> : <IconArrowUp />}
              </ActionIcon>
            </Group>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
