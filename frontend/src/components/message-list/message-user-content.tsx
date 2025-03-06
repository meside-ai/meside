import { Box, Button, Paper } from "@mantine/core";
import type { MessageDto } from "@meside/api/message.schema";
import type { EditorJSONContent } from "@meside/shared/editor-json-to-markdown";
import { parseJsonOrNull } from "@meside/shared/json";
import { IconPencil } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { useSendMessage } from "../chat/use-send-message";
import { EditorJsonMarkdown } from "../markdown/editor-json-markdown";
import { MessageInput } from "../message-input/message-input";

export type MessageUserContentProps = {
  message: MessageDto;
};

export const MessageUserContent = ({ message }: MessageUserContentProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(
    message.structure.type === "userContent" && !message.structure.content
  );

  const {
    handleMessage,
    isLoading,
    // isSendingUserMessage,
    // isGettingAssistantResponse,
    // assistantError,
  } = useSendMessage({
    parentThreadId: message.threadId,
  });

  const initialJSONContent = useMemo(() => {
    if (message.structure.type !== "userContent") {
      return undefined;
    }
    const json = parseJsonOrNull(message.structure.content);
    if (!json) {
      return undefined;
    }
    return json;
  }, [message.structure]);

  const handleSubmit = useCallback(
    (json: EditorJSONContent) => {
      handleMessage(json);
      setIsEditing(false);
    },
    [handleMessage]
  );

  if (message.structure.type !== "userContent") {
    return null;
  }

  return (
    <Box>
      {isEditing ? (
        <Paper withBorder p="xs" radius="lg">
          <MessageInput
            initialJSONContent={initialJSONContent}
            submit={handleSubmit}
            loading={isLoading}
            placeholder="Ask me anything"
            state={{
              warehouseId: undefined,
            }}
          />
        </Paper>
      ) : (
        <Box>
          <EditorJsonMarkdown>{message.structure.content}</EditorJsonMarkdown>
          <Box>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconPencil size={16} />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
