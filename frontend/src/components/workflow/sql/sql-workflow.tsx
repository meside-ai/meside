import { WarehouseCard } from "@/components/warehouse/warehouse-card";
import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Button } from "@mantine/core";
import { Text } from "@mantine/core";
import { Box } from "@mantine/core";
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
      afterAssistantContent={
        question.assistantContent && (
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
        )
      }
      previewPanel={
        <Box>
          <TableVirtualView questionId={question.questionId} />
        </Box>
      }
    />
  );
};
