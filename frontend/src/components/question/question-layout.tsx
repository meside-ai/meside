import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import type { QuestionDto } from "@meside/api/question.schema";
import type { EditorJSONContent } from "@meside/shared/editor-json-to-markdown";
import { parseJsonOrNull } from "@meside/shared/json";
import { IconPencil, IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { EditorJsonMarkdown } from "../markdown/editor-json-markdown";
import { MessageInput } from "../message-input/message-input";
import { useSendQuestion } from "./use-send-question";

export type QuestionLayoutProps = {
  question: QuestionDto;
  beforeUserContent?: JSX.Element | JSX.Element[];
  afterUserContent?: JSX.Element | JSX.Element[];
  afterUserEdit?: JSX.Element | JSX.Element[];
  beforeAssistantReason?: JSX.Element | JSX.Element[];
  beforeAssistantContent?: JSX.Element | JSX.Element[];
  afterAssistantContent?: JSX.Element | JSX.Element[];
  afterAssistantAction?: JSX.Element | JSX.Element[];
  leftAssistantAction?: JSX.Element | JSX.Element[];
};

export const QuestionLayout = ({
  question,
  beforeUserContent,
  afterUserContent,
  afterUserEdit,
  beforeAssistantReason,
  beforeAssistantContent,
  afterAssistantContent,
  afterAssistantAction,
  leftAssistantAction,
}: QuestionLayoutProps) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Box>
      <Box>
        {beforeUserContent}
        {isEditing && (
          <UserContentEditor question={question} setIsEditing={setIsEditing} />
        )}
        {!isEditing && (
          <EditorJsonMarkdown>{question.userContent}</EditorJsonMarkdown>
        )}
        {afterUserContent}
        {!isEditing && (
          <Box>
            <Group mb="xs" gap={0}>
              <Tooltip label="Edit">
                <Button
                  variant="transparent"
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                  leftSection={<IconPencil size={14} />}
                >
                  Edit
                </Button>
              </Tooltip>
            </Group>
          </Box>
        )}
        {afterUserEdit}
      </Box>
      <Divider />
      <Box>
        {beforeAssistantReason}
        <Text>{question.assistantReason}</Text>
        {beforeAssistantContent}
        <Text>{question.assistantContent}</Text>
        {afterAssistantContent}
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
