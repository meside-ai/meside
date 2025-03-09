import { Box, Paper } from "@mantine/core";
import { useEffect, useState } from "react";
import { MessageInput } from "../message-input/message-input";
import { usePreviewContext } from "../preview/preview-context";
import { useSendQuestion } from "../question/use-send-question";
import { ChooseWarehouse } from "./choose-warehouse";

export const DbWorkflowStarter = () => {
  const [warehouseId, setWarehouseId] = useState<string | null>(null);

  const { openPreview } = usePreviewContext();

  useEffect(() => {
    if (warehouseId) {
      openPreview({
        name: "Warehouse explorer",
        payload: {
          type: "warehouseColumn",
          warehouseId,
        },
      });
    }
  }, [openPreview, warehouseId]);

  const { handleQuestion, isSendingQuestion } = useSendQuestion({
    parentQuestionId: null,
    versionId: null,
    questionPayload: {
      type: "sql",
      sql: "",
      warehouseId: warehouseId ?? "",
      fields: [],
    },
  });

  return (
    <Box>
      <Box mb="md">
        <ChooseWarehouse
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
        />
      </Box>
      {warehouseId && (
        <Paper withBorder p="md" shadow="lg" radius="lg">
          <MessageInput
            submit={handleQuestion}
            loading={isSendingQuestion}
            placeholder="Ask me anything"
            state={{
              warehouseId: warehouseId ?? undefined,
            }}
          />
        </Paper>
      )}
    </Box>
  );
};
