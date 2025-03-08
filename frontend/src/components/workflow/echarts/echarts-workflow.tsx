import { EchartsLazyLoader } from "@/components/echarts/echarts-lazy-loader";
import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Box } from "@mantine/core";
import { useMemo } from "react";
import type { WorkflowProps } from "../workflow-types";

export const EchartsWorkflow = ({
  question,
  isGettingAnswer,
  answerError,
  renderQuestionLayout,
}: WorkflowProps) => {
  const questionLayout = useMemo(() => {
    if (question.payload.type !== "echarts") {
      return null;
    }

    return renderQuestionLayout({
      question,
      isGettingAnswer,
      answerError,
      afterAssistantContent: (
        <>
          {question.assistantContent && (
            <Box
              w={MESSAGE_CONTENT_WIDTH}
              h={300}
              display="flex"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box w={500} h={300}>
                <EchartsLazyLoader questionId={question.questionId} />
              </Box>
            </Box>
          )}
        </>
      ),
    });
  }, [answerError, isGettingAnswer, question, renderQuestionLayout]);

  return <>{questionLayout}</>;
};
