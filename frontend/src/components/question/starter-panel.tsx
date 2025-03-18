import { getQuestionDetail } from "@/queries/question";
import { Box, Group, Radio, ScrollArea, Stack, Text } from "@mantine/core";
import type { QuestionDto } from "@meside/api/question.schema";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { usePreviewContext } from "../preview/preview-context";
import { useQuestionContext } from "../question/context";
import { useWorkflowButtons } from "../workflow/starter-buttons";
import { StarterFactory } from "../workflow/starter-factory";

export const StarterPanel = () => {
  const { quotedQuestionId } = useQuestionContext();
  const { openPreview } = usePreviewContext();

  const [workflowType, setWorkflowType] = useState<
    null | QuestionDto["payload"]["type"]
  >(null);

  const quotedQuestionResult = useQuery(
    getQuestionDetail({ questionId: quotedQuestionId ?? "" }),
  );

  const workflowButtons = useWorkflowButtons();

  const buttons = useMemo(() => {
    const type = quotedQuestionResult.data?.question?.payload.type ?? null;
    return workflowButtons.filter((button) =>
      button.quotedType?.includes(type),
    );
  }, [quotedQuestionResult.data?.question?.payload.type, workflowButtons]);

  const cards = useMemo(
    () =>
      buttons.map((item) => (
        <Radio.Card p="md" radius="md" value={item.type} key={item.type}>
          <Group wrap="nowrap" align="center">
            <Radio.Indicator />
            <Box>
              <Text>{item.label}</Text>
              <Text size="xs">{item.description}</Text>
            </Box>
          </Group>
        </Radio.Card>
      )),
    [buttons],
  );

  return (
    <Box h="100%">
      <ScrollArea h="100%" style={{ overflow: "hidden" }}>
        <Box p="md">
          <Box mb="md">
            <Radio.Group
              label="Choose a workflow to get started"
              description="Choose a workflow that you will need in your question"
              value={workflowType}
              onChange={(workflowType) => {
                setWorkflowType(workflowType as QuestionDto["payload"]["type"]);
              }}
            >
              <Stack pt="md" gap="xs">
                {cards}
              </Stack>
            </Radio.Group>
            {/* {buttons.map((button) => (
          <Button
            key={button.type}
            size="sm"
            variant={workflowType === button.type ? "light" : "subtle"}
            onClick={() => setWorkflowType(button.type)}
          >
            {button.label}
          </Button>
        ))} */}
          </Box>
          {workflowType && (
            <Box>
              <StarterFactory
                workflowType={workflowType}
                quotedQuestion={quotedQuestionResult.data?.question ?? null}
                openPreview={openPreview}
              />
            </Box>
          )}
        </Box>
      </ScrollArea>
    </Box>
  );
};
