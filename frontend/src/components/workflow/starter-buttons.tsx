import type { QuestionDto } from "@meside/shared/api/question.schema";
import { useMemo } from "react";

export const useWorkflowButtons = () => {
  const workflowButtons = useMemo<WorkflowButton[]>(
    () => [
      {
        type: "sql",
        label: "Getting data with SQL",
        description:
          "Ask me about this warehouse, for example, explain album has relation with artist",
        quotedType: [null, "relation"],
      },
      {
        type: "echarts",
        label: "Visualize data with charts",
        description:
          "Ask me about this warehouse, for example, explain album has relation with artist",
        quotedType: ["sql", "echarts"],
      },
      {
        type: "relation",
        label: "Explore warehouse",
        description:
          "Ask me about this warehouse, for example, explain album has relation with artist",
        quotedType: [null, "relation"],
      },
    ],
    [],
  );

  return workflowButtons;
};

type WorkflowButton = {
  type: QuestionDto["payload"]["type"];
  label: string;
  quotedType: (QuestionDto["payload"]["type"] | null)[];
  description?: string;
};
