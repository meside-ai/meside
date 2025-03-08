import { Badge, Box, Group, Paper, Text, Title } from "@mantine/core";
import type { QuestionDto } from "@meside/api/question.schema";
import { MessageInput } from "../message-input/message-input";
import { useSendQuestion } from "../question/use-send-question";

export type EchartsWorkflowStarterProps = {
  quotedQuestion?: QuestionDto;
};

export const EchartsWorkflowStarter = ({
  quotedQuestion,
}: EchartsWorkflowStarterProps) => {
  const { handleQuestion, isSendingQuestion } = useSendQuestion({
    parentQuestionId: null,
    versionId: null,
    questionPayload: {
      type: "echarts",
      warehouseId: quotedQuestion?.payload.warehouseId ?? "",
      sql: quotedQuestion?.payload.sql ?? "",
      fields: quotedQuestion?.payload.fields ?? [],
      echartsOptions: "",
    },
  });

  if (!quotedQuestion) {
    return <Text>No quoted question</Text>;
  }

  return (
    <Box>
      <Title order={5} mb="md">
        Suggestion:
      </Title>
      <Group style={{ gap: 4 }} mb="md">
        {echartsExample.map((example) => (
          <Badge
            key={example}
            variant="outline"
            style={{
              textTransform: "none",
            }}
          >
            {example}
          </Badge>
        ))}
      </Group>

      <Paper withBorder p="md" shadow="lg" radius="lg">
        <MessageInput
          submit={handleQuestion}
          loading={isSendingQuestion}
          placeholder="Describe your chart based on your quoted data"
          state={{
            warehouseId: quotedQuestion.payload.warehouseId,
          }}
        />
      </Paper>
    </Box>
  );
};

const echartsExample: string[] = [
  "bar chart",
  "line chart",
  "pie chart",
  "scatter chart",
  "heatmap chart",
  "treemap chart",
  "sunburst chart",
];
