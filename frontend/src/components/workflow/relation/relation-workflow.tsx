import { Box } from "@mantine/core";
import { useMemo } from "react";
import { WarehouseCard } from "../../warehouse/warehouse-card";
import type { WorkflowProps } from "../workflow-types";

export const RelationWorkflow = ({
  question,
  isGettingAnswer,
  answerError,
  renderQuestionLayout,
}: WorkflowProps) => {
  const questionLayout = useMemo(() => {
    if (question.payload.type !== "relation") {
      return null;
    }

    return renderQuestionLayout({
      question,
      isGettingAnswer,
      answerError,
      beforeUserContent: (
        <Box mb="md">
          <WarehouseCard warehouseId={question?.payload?.warehouseId} />
        </Box>
      ),
    });
  }, [answerError, isGettingAnswer, question, renderQuestionLayout]);

  return <>{questionLayout}</>;
};
