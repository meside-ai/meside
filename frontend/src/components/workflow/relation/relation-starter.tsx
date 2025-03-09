import { ChooseWarehouse } from "@/components/warehouse/choose-warehouse";
import { Box, Paper } from "@mantine/core";
import { useEffect, useState } from "react";
import { MessageInput } from "../../message-input/message-input";
import { useSendQuestion } from "../../question/use-send-question";
import type { StarterProps } from "../starter-types";

export const RelationStarter = ({
  openPreview,
  quotedQuestion,
}: StarterProps) => {
  const [warehouseId, setWarehouseId] = useState<string | null>(null);

  useEffect(() => {
    if (warehouseId) {
      openPreview({
        name: "Warehouse explorer",
        payload: {
          type: "previewWarehouse",
          warehouseId,
        },
      });
    }
  }, [openPreview, warehouseId]);

  const { handleQuestion, isSendingQuestion } = useSendQuestion({
    parentQuestionId: quotedQuestion?.questionId ?? null,
    versionId: null,
    questionPayload: {
      type: "relation",
      warehouseId: warehouseId ?? "",
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
            placeholder="Ask me about this warehouse, for example, explain album has relation with artist"
            state={{
              warehouseId: warehouseId ?? undefined,
            }}
          />
        </Paper>
      )}
    </Box>
  );
};
