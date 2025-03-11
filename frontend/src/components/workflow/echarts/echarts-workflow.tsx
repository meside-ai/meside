import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Box, Text } from "@mantine/core";
import { CollapseCard } from "../common/collapse-card";
import { MarkdownAssistantContent } from "../common/markdown-assistant-content";
import type { WorkflowProps } from "../workflow-types";
import { EchartsLazyLoader } from "./components/echarts-lazy-loader";

export const EchartsWorkflow = (props: WorkflowProps) => {
  const { injectedQuestionLayout: InjectedQuestionLayout, question } = props;

  if (question.payload.type !== "echarts") {
    return <Text>Not a echarts question</Text>;
  }

  return (
    <InjectedQuestionLayout
      {...props}
      renderAssistantContent={
        <Box>
          {question.assistantStatus === "pending" ? (
            <Box>
              <Text>Generating...</Text>
            </Box>
          ) : null}
          {question.assistantStatus === "success" ? (
            <CollapseCard>
              <MarkdownAssistantContent
                assistantContent={question.assistantContent}
              />
            </CollapseCard>
          ) : null}
          {question.assistantStatus === "success" ? (
            <Box
              w={MESSAGE_CONTENT_WIDTH}
              h={300}
              display="flex"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                w={500}
                h={300}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                }}
              >
                <EchartsLazyLoader questionId={question.questionId} />
              </Box>
            </Box>
          ) : null}
        </Box>
      }
    />
  );
};
