import type { ToolInvocationUIPart, UIMessage } from "@ai-sdk/ui-utils";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Loader,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconSettingsSpark,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getThreadDetail } from "../../queries/thread";
import { useThreadContext } from "../chat/context";
import { AssistantHeader } from "./assistant-header";
import { EditThreadInput } from "./edit-thread-input";
import { MarkdownPart } from "./markdown-part";

export const ThreadRender = ({
  messages,
  loading,
}: {
  messages: UIMessage[];
  loading?: boolean;
}) => {
  return (
    <Box style={{ height: "100%", overflow: "auto" }}>
      <ScrollArea scrollbars="y">
        <Box p="md">
          {messages.map((message) => (
            <>
              {message.role === "user" ? (
                <UserMessageRender key={message.id} message={message} />
              ) : (
                <AssistantMessageRender key={message.id} message={message} />
              )}
            </>
          ))}
          {loading && (
            <Box>
              <Loader type="dots" />
            </Box>
          )}
        </Box>
      </ScrollArea>
    </Box>
  );
};

const UserMessageRender = ({ message }: { message: UIMessage }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box mb="lg">
      {isEditing && (
        <EditThreadInput isEditing={isEditing} setIsEditing={setIsEditing} />
      )}
      {!isEditing && (
        <Box display="flex" style={{ justifyContent: "flex-end" }}>
          <Box style={{ order: 2 }} ml="lg">
            <Avatar>CW</Avatar>
          </Box>
          <Box
            style={{
              order: 1,
              textAlign: "right",
            }}
            mt={6}
          >
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <MarkdownPart key={`${message.id}-${i}`} part={part} />
                  );
              }
            })}
          </Box>
        </Box>
      )}
      {!isEditing && (
        <Group justify="flex-end" align="center" gap="xs" mt="md">
          <Box display="flex" style={{ justifyContent: "space-between" }}>
            <ThreadSiblings />
          </Box>
          <Box>
            <Button
              variant="transparent"
              onClick={() => {
                setIsEditing(!isEditing);
              }}
              leftSection={<IconPencil size={14} />}
            >
              Edit
            </Button>
          </Box>
        </Group>
      )}
    </Box>
  );
};

const AssistantMessageRender = ({ message }: { message: UIMessage }) => {
  return (
    <Box>
      <AssistantHeader />
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "reasoning":
            return <div>Reasoning {part.reasoning}</div>;
          case "tool-invocation":
            return <ToolInvocationRender part={part} />;
          case "text":
            return <MarkdownPart key={`${message.id}-${i}`} part={part} />;
        }
      })}
    </Box>
  );
};

const ToolInvocationRender = ({ part }: { part: ToolInvocationUIPart }) => {
  return (
    <Box mb="sm">
      <Button
        variant="outline"
        size="sm"
        radius="lg"
        leftSection={<IconSettingsSpark size={12} />}
      >
        {part.toolInvocation.toolName}
      </Button>
    </Box>
  );
};

const ThreadSiblings = () => {
  const { threadId, setThreadId } = useThreadContext();

  const { data } = useQuery(getThreadDetail({ threadId: threadId ?? "" }));

  const siblingIds = useMemo(() => {
    return data?.thread?.siblingIds ?? [];
  }, [data?.thread?.siblingIds]);

  const totalCount = useMemo(() => {
    return siblingIds.length;
  }, [siblingIds.length]);

  const currentIndex = useMemo(() => {
    return siblingIds.indexOf(threadId ?? "");
  }, [siblingIds, threadId]);

  if (totalCount === 1) {
    return null;
  }

  return (
    <Group gap={0} align="center">
      <ActionIcon
        variant="transparent"
        onClick={() => {
          const index = siblingIds[currentIndex - 1];
          if (!index) {
            return;
          }
          setThreadId(index);
        }}
        style={{
          visibility: currentIndex > 0 ? "visible" : "hidden",
        }}
      >
        <IconChevronLeft size={14} />
      </ActionIcon>
      <Text>
        {currentIndex + 1}/{totalCount}
      </Text>
      <ActionIcon
        variant="transparent"
        onClick={() => {
          const index = siblingIds[currentIndex + 1];
          if (!index) {
            return;
          }
          setThreadId(index);
        }}
        style={{
          visibility: currentIndex < totalCount - 1 ? "visible" : "hidden",
        }}
      >
        <IconChevronRight size={14} />
      </ActionIcon>
    </Group>
  );
};
