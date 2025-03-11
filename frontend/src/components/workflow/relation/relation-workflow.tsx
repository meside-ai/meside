import { WarehouseCard } from "@/components/warehouse/warehouse-card";
import { Box, Text } from "@mantine/core";
import { MarkdownAssistantContent } from "../common/markdown-assistant-content";
import type { WorkflowProps } from "../workflow-types";

export const RelationWorkflow = (props: WorkflowProps) => {
  const { injectedQuestionLayout: InjectedQuestionLayout, question } = props;

  if (question.payload.type !== "relation") {
    return <Text>Not a relation question</Text>;
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
          <MarkdownAssistantContent
            assistantContent={question.assistantContent}
          />
        </Box>
      }
    />
  );
};
