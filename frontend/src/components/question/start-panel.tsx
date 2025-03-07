import { Box, Paper } from "@mantine/core";
import { useState } from "react";
import { MessageInput } from "../message-input/message-input";
import { useSendQuestion } from "./use-send-question";

export const StartPanel = () => {
  const [warehouseId] = useState<string | null>(null);

  const { handleQuestion, isSendingQuestion } = useSendQuestion({
    parentQuestionId: null,
    versionId: null,
    questionPayload: {
      type: "db",
      sql: "",
      warehouseId: "zhl0ec34cda00wgufqsqe80d", // TODO: get warehouse id from user
      fields: [],
    },
  });

  return (
    <Box px="md" pb="md">
      <Paper withBorder p="md" shadow="lg" radius="lg">
        {/* <Group mb="sm" gap="xs">
      <Button
        variant="light"
        size="xs"
        leftSection={<IconSql size={14} />}
      >
        SQL query
      </Button>
      <Button
        variant="transparent"
        size="xs"
        leftSection={<IconZoomQuestion size={14} />}
      >
        column suggestions
      </Button>
    </Group> */}
        <MessageInput
          submit={handleQuestion}
          loading={isSendingQuestion}
          placeholder="Ask me anything"
          state={{
            warehouseId: warehouseId ?? undefined,
          }}
        />
      </Paper>
    </Box>
  );
};
