import { Box } from "@mantine/core";
import { useMemo } from "react";
import { WarehouseCard } from "../warehouse/warehouse-card";
import type { WorkflowProps } from "./workflow-types";

export const DbWorkflow = ({
  question,
  isGettingAnswer,
  answerError,
  renderQuestionLayout,
}: WorkflowProps) => {
  const questionLayout = useMemo(() => {
    if (question.payload.type !== "db") {
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
        <Box>
          {/* <Box
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
            <TableView messageId={message.messageId} compact />
          </Box>
          <Button
          size="xs"
          variant="light"
          onClick={() => {
              openPreview({
                name: question.shortName ?? "DB Query",
                payload: {
                  type: "warehouseTable",
                  messageId: question.messageId,
                },
              });
          }}
          fullWidth
        >
          View more data
        </Button> */}
        </Box>
      ),
    });
  }, [answerError, isGettingAnswer, question, renderQuestionLayout]);

  if (question.payload.type !== "db") {
    return null;
  }

  return <>{questionLayout}</>;
};
