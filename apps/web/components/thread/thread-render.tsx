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
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconSettingsSpark,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { getThreadDetail } from "../../queries/thread";
import { useThreadContext } from "../chat/context";
import { AssistantHeader } from "./assistant-header";
import { EditThreadInput } from "./edit-thread-input";
import { MarkdownPart } from "./markdown-part";
import type { AddToolResult } from "./new-thread-message.type";

export const ThreadRender = ({
  messages,
  loading,
  addToolResult,
}: {
  messages: UIMessage[];
  loading?: boolean;
  addToolResult?: AddToolResult;
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
                <AssistantMessageRender
                  key={message.id}
                  message={message}
                  addToolResult={addToolResult}
                />
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

const AssistantMessageRender = ({
  message,
  addToolResult,
}: { message: UIMessage; addToolResult?: AddToolResult }) => {
  return (
    <Box>
      <AssistantHeader />
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "reasoning":
            return <div>Reasoning {part.reasoning}</div>;
          case "tool-invocation":
            return (
              <ToolInvocationRender part={part} addToolResult={addToolResult} />
            );
          case "text":
            return <MarkdownPart key={`${message.id}-${i}`} part={part} />;
        }
      })}
    </Box>
  );
};

const ToolInvocationRender = ({
  part,
  addToolResult,
}: { part: ToolInvocationUIPart; addToolResult?: AddToolResult }) => {
  console.log("part", JSON.stringify(part, null, 2), addToolResult);
  if (
    part.toolInvocation.toolName === "human-input" &&
    part.toolInvocation.state === "call" &&
    addToolResult
  ) {
    return <HumanInputRender part={part} addToolResult={addToolResult} />;
  }

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

const HumanInputRender = ({
  part,
  addToolResult,
}: { part: ToolInvocationUIPart; addToolResult: AddToolResult }) => {
  const toolInvocation = part.toolInvocation;
  const toolCallId = toolInvocation.toolCallId;
  const form = useForm({
    initialValues: {
      input: "",
    },
    validate: zodResolver(
      z.object({
        input: z.string().min(1),
      }),
    ),
  });

  return (
    <Box mb="sm">
      <Text>{JSON.stringify(toolInvocation.args)}</Text>
      <form
        onSubmit={form.onSubmit((values) => {
          addToolResult({
            toolCallId,
            result: values.input,
          });
        })}
      >
        <Textarea {...form.getInputProps("input")} />
        <Button type="submit">Confirm</Button>
      </form>
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
