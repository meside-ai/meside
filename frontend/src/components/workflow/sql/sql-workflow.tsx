import { WarehouseCard } from "@/components/warehouse/warehouse-card";
import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Button } from "@mantine/core";
import { Text } from "@mantine/core";
import { Box } from "@mantine/core";
import { CollapseCard } from "../common/collapse-card";
import { MarkdownAssistantContent } from "../common/markdown-assistant-content";
import type { WorkflowProps } from "../workflow-types";
import { TableView } from "./components/table-view";
import { TableVirtualView } from "./components/table-virtual-view";

export const SqlWorkflow = (props: WorkflowProps) => {
  const {
    injectedQuestionLayout: InjectedQuestionLayout,
    question,
    openPreview,
  } = props;

  if (question.payload.type !== "sql") {
    return <Text>Not a sql question</Text>;
  }

  return (
    <InjectedQuestionLayout
      {...props}
      beforeUserContent={
        <Box mb="md">
          <WarehouseCard warehouseId={question?.payload?.warehouseId} />
        </Box>
      }
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
            <Box>
              <Box
                w={MESSAGE_CONTENT_WIDTH}
                h={200}
                mb="sm"
                style={(theme) => ({
                  border: "solid 1px",
                  borderColor: theme.colors.gray[7],
                  borderRadius: 6,
                  overflow: "hidden",
                })}
              >
                <TableView questionId={question.questionId} />
              </Box>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  openPreview({
                    name: question.shortName ?? "DB Query",
                    payload: {
                      type: "previewQuestion",
                      questionId: question.questionId,
                    },
                  });
                }}
                fullWidth
              >
                View more data
              </Button>
            </Box>
          ) : null}
        </Box>
      }
      previewPanel={
        <Box>
          <TableVirtualView questionId={question.questionId} />
        </Box>
      }
    />
  );
};
