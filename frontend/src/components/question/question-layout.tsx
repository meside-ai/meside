import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Loader,
  Popover,
  Text,
  Tooltip,
} from "@mantine/core";
import type { QuestionDto } from "@meside/api/question.schema";
import type { EditorJSONContent } from "@meside/shared/editor-json-to-markdown";
import { parseJsonOrNull } from "@meside/shared/json";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconThumbDown,
  IconThumbUp,
  IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { EditorJsonMarkdown } from "../markdown/editor-json-markdown";
import { MessageInput } from "../message-input/message-input";
import type { InjectedQuestionLayoutProps } from "../workflow/workflow-types";
import { useQuestionContext } from "./context";
import { useSendQuestion } from "./use-send-question";

export const QuestionLayout = ({
  question,
  beforeUserContent,
  afterUserContent,
  afterUserEdit,
  beforeAssistantReason,
  // beforeAssistantContent,
  // afterAssistantContent,
  renderAssistantContent,
  afterAssistantAction,
  leftAssistantAction,
  isGettingAnswer,
  answerError,
}: InjectedQuestionLayoutProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { setQuotedQuestionId } = useQuestionContext();

  return (
    <Box mx="md">
      <Box>
        {beforeUserContent}
        {isEditing && (
          <Box
            style={(theme) => ({
              border: `1px solid ${theme.colors.gray[8]}`,
              borderRadius: 20,
              padding: 10,
            })}
            mb="md"
          >
            <UserContentEditor
              question={question}
              setIsEditing={setIsEditing}
            />
            <Box display="flex" style={{ justifyContent: "flex-end" }} pt="xs">
              <Button
                variant="light"
                size="xs"
                onClick={() => setIsEditing(false)}
                leftSection={<IconX size={14} />}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
        {!isEditing && (
          <Box display="flex" style={{ justifyContent: "flex-end" }}>
            <Tooltip label="Edit">
              <Button
                variant="transparent"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
                leftSection={<IconPencil size={14} />}
                mt={10}
              >
                Edit
              </Button>
            </Tooltip>
            <Box
              style={(theme) => ({
                minWidth: 200,
                backgroundColor: theme.colors.gray[8],
                borderRadius: 20,
                padding: 20,
              })}
            >
              <EditorJsonMarkdown>{question.userContent}</EditorJsonMarkdown>
            </Box>
          </Box>
        )}
        {afterUserContent}
        {!isEditing && (
          <Box display="flex" style={{ justifyContent: "space-between" }}>
            <Box w={1} />
            <QuestionSiblings question={question} />
          </Box>
        )}
        {afterUserEdit}
      </Box>
      <Box>
        {(question.assistantReason ||
          question.assistantContent ||
          isGettingAnswer ||
          answerError) && <AssistantHeader question={question} />}
        {isGettingAnswer && (
          <Box>
            <Loader type="dots" />
          </Box>
        )}
        {answerError && (
          <Box>
            <Text>Error: {answerError.message}</Text>
          </Box>
        )}
        {beforeAssistantReason}
        <Box
          ml="md"
          pl="md"
          style={(theme) => ({
            borderLeft: `3px solid ${theme.colors.gray[8]}`,
            maxWidth: MESSAGE_CONTENT_WIDTH - 40,
          })}
        >
          <EditorJsonMarkdown>{question.assistantReason}</EditorJsonMarkdown>
        </Box>
        {renderAssistantContent}
        <Box>
          <Group mb="xs" gap={0}>
            {leftAssistantAction}
            <Tooltip label="Good response">
              <ActionIcon variant="transparent" onClick={() => {}}>
                <IconThumbUp size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Bad response">
              <ActionIcon variant="transparent" onClick={() => {}}>
                <IconThumbDown size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
        {afterAssistantAction}
        <Box>
          <Button
            size="xs"
            variant="light"
            onClick={() => {
              setQuotedQuestionId(question.questionId);
            }}
          >
            Quote this to ask a new question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const UserContentEditor = ({
  question,
  setIsEditing,
}: {
  question: QuestionDto;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const { handleQuestion, isSendingQuestion } = useSendQuestion({
    parentQuestionId: null,
    versionId: question.versionId,
    questionPayload: question.payload,
  });

  const initialValue = useMemo(() => {
    return parseJsonOrNull<EditorJSONContent>(question.userContent);
  }, [question.userContent]);

  return (
    <Box>
      <MessageInput
        initialJSONContent={initialValue ?? undefined}
        submit={(json) => {
          handleQuestion(json);
          setIsEditing(false);
        }}
        loading={isSendingQuestion}
        placeholder="Ask me anything"
        state={{
          warehouseId:
            "warehouseId" in question.payload
              ? question.payload.warehouseId
              : undefined,
        }}
      />
    </Box>
  );
};

const QuestionSiblings = ({ question }: { question: QuestionDto }) => {
  const { setQuestionId } = useQuestionContext();
  const siblingIds = useMemo(() => {
    return question?.siblingIds ?? [];
  }, [question?.siblingIds]);

  const totalCount = useMemo(() => {
    return siblingIds.length;
  }, [siblingIds.length]);

  const currentIndex = useMemo(() => {
    return siblingIds.indexOf(question.questionId);
  }, [siblingIds, question.questionId]);

  if (totalCount === 1) {
    return null;
  }

  return (
    <Group gap={0} align="center">
      <ActionIcon
        variant="transparent"
        onClick={() => {
          setQuestionId(siblingIds[currentIndex - 1]);
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
          setQuestionId(siblingIds[currentIndex + 1]);
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

const AssistantHeader = ({ question }: { question: QuestionDto }) => {
  return (
    <Box>
      <Box
        display="inline-flex"
        style={(theme) => ({
          alignItems: "center",
          gap: 12,
          border: `1px solid ${theme.colors.gray[8]}`,
          padding: 4,
          paddingLeft: 12,
          paddingRight: 12,
          borderRadius: 30,
        })}
        mb="md"
      >
        <Popover position="bottom" withArrow shadow="md" withinPortal>
          <Popover.Target>
            <Avatar size="sm" radius="xl" color="blue">
              M
            </Avatar>
          </Popover.Target>
          <Popover.Dropdown>
            <Text>ID: {question.questionId}</Text>
            <Text>Created at: {question.createdAt}</Text>
            <Text>Updated at: {question.updatedAt}</Text>
            <Text>payload type: {question.payload.type}</Text>
          </Popover.Dropdown>
        </Popover>
        <Text>Meside</Text>
      </Box>
    </Box>
  );
};
