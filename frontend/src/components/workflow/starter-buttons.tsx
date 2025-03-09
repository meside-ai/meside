import type { QuestionDto } from "@meside/api/question.schema";
import { useMemo } from "react";

export const useWorkflowButtons = () => {
  const workflowButtons = useMemo<WorkflowButton[]>(
    () => [
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
      {
        type: "relation",
        label: "Warehouse explorer",
        quotedType: null,
      },
    ],
    []
  );

  return workflowButtons;
};

type WorkflowButton = {
  type: QuestionDto["payload"]["type"];
  label: string;
  quotedType: QuestionDto["payload"]["type"][] | null;
};
