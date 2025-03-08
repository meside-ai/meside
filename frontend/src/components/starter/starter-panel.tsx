import { getQuestionDetail } from "@/queries/question";
import { Box, Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useQuestionContext } from "../question/context";
import { DbWorkflowStarter } from "./db-workflow-starter";
import { EchartsWorkflowStarter } from "./echarts-workflow-starter";
export const StarterPanel = () => {
  const { quotedQuestionId } = useQuestionContext();

  const [workflowType, setWorkflowType] = useState<null | "db" | "echarts">(
    null
  );

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
      <Box>{workflowType === "db" && <DbWorkflowStarter />}</Box>
      <Box>
        {workflowType === "echarts" && (
          <EchartsWorkflowStarter
            quotedQuestion={quotedQuestionResult.data?.question ?? undefined}
          />
        )}
      </Box>
    </Box>
  );
};

const workflowButtons: {
  type: "db" | "echarts";
  label: string;
  quotedType: ("db" | "echarts")[] | null;
}[] = [
  {
    type: "db",
    label: "Data warehouse query",
    quotedType: null,
  },
  {
    type: "echarts",
    label: "Charts",
    quotedType: ["db", "echarts"],
  },
];
