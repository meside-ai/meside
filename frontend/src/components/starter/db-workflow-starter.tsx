import { Box, Paper } from "@mantine/core";
import { useState } from "react";
import { MessageInput } from "../message-input/message-input";
import { useSendQuestion } from "../question/use-send-question";
import { ChooseWarehouse } from "./choose-warehouse";

export const DbWorkflowStarter = () => {
  const [warehouseId, setWarehouseId] = useState<string | null>(null);

  const { handleQuestion, isSendingQuestion } = useSendQuestion({
    parentQuestionId: null,
    versionId: null,
    questionPayload: {
      type: "db",
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
