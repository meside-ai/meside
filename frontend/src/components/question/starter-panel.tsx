import { getQuestionDetail } from "@/queries/question";
import { Box, Button } from "@mantine/core";
import type { QuestionDto } from "@meside/api/question.schema";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { usePreviewContext } from "../preview/preview-context";
import { useQuestionContext } from "../question/context";
import { StarterFactory } from "../workflow/starter-factory";

export const StarterPanel = () => {
  const { quotedQuestionId } = useQuestionContext();
  const { openPreview } = usePreviewContext();

  const [workflowType, setWorkflowType] = useState<
    null | QuestionDto["payload"]["type"]
  >(null);

  const quotedQuestionResult = useQuery(
    getQuestionDetail({ questionId: quotedQuestionId ?? "" })
  );

  const buttons = useMemo(() => {
    const type = quotedQuestionResult.data?.question?.payload.type;
    if (!type) {
      return workflowButtons.filter((button) => button.quotedType === null);
    }
    return workflowButtons.filter((button) =>
      button.quotedType?.includes(type)
    );
  }, [quotedQuestionResult.data?.question?.payload.type]);

  return (
    <Box p="md">
      <Box mb="sm">Choose a workflow to get started</Box>
      <Box mb="md">
        <Button.Group>
          {buttons.map((button) => (
            <Button
              key={button.type}
              size="xs"
              variant={workflowType === button.type ? "light" : "outline"}
              onClick={() => setWorkflowType(button.type)}
            >
              {button.label}
            </Button>
          ))}
        </Button.Group>
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
  );
};

const workflowButtons: {
  type: QuestionDto["payload"]["type"];
  label: string;
  quotedType: QuestionDto["payload"]["type"][] | null;
}[] = [
  {
    type: "sql",
    label: "Data warehouse query",
    quotedType: null,
  },
  {
    type: "echarts",
    label: "Charts",
    quotedType: ["sql", "echarts"],
  },
];
