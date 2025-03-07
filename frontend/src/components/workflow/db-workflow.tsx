import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Box } from "@mantine/core";
import { useMemo } from "react";
import { usePreviewContext } from "../preview/preview-context";
import { WarehouseCard } from "../warehouse/warehouse-card";
import type { WorkflowProps } from "./workflow-types";

export const DbWorkflow = ({
  question,
  renderQuestionLayout,
}: WorkflowProps) => {
  const { openPreview } = usePreviewContext();

  const questionLayout = useMemo(() => {
    if (question.payload.type !== "db") {
      return null;
    }

    return renderQuestionLayout({
      question,
      beforeUserContent: (
        <Box>
          <WarehouseCard warehouseId={question?.payload?.warehouseId} />
        </Box>
      ),
      afterAssistantContent: (
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
            {/* <TableView messageId={message.messageId} compact /> */}
          </Box>
          {/* <Button
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
  }, [question, renderQuestionLayout]);

  if (question.payload.type !== "db") {
    return null;
  }

  return <>{questionLayout}</>;
};
