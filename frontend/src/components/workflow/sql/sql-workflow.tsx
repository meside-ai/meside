import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Box, Button } from "@mantine/core";
import { useMemo } from "react";
import { usePreviewContext } from "../../preview/preview-context";
import { WarehouseCard } from "../../warehouse/warehouse-card";
import type { WorkflowProps } from "../workflow-types";
import { TableView } from "./components/table-view";
import { TableVirtualView } from "./components/table-virtual-view";

export const SqlWorkflow = ({
  question,
  isGettingAnswer,
  answerError,
  renderQuestionLayout,
}: WorkflowProps) => {
  const { openPreview } = usePreviewContext();

  const questionLayout = useMemo(() => {
    if (question.payload.type !== "sql") {
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
      afterAssistantContent: (
        <>
          {question.assistantContent && (
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
          )}
        </>
      ),
      previewPanel: (
        <Box>
          <TableVirtualView questionId={question.questionId} />
        </Box>
      ),
    });
  }, [
    answerError,
    isGettingAnswer,
    openPreview,
    question,
    renderQuestionLayout,
  ]);

  return <>{questionLayout}</>;
};
