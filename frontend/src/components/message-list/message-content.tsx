import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Box, Code, Text } from "@mantine/core";
import type { MessageDto } from "@meside/api/message.schema";
import { EditorJsonMarkdown } from "../markdown/editor-json-markdown";
import { WarehouseCard } from "../warehouse/warehouse-card";

export const MessageContent = ({ message }: { message: MessageDto }) => {
  if (!message?.structure?.type) {
    return <Text>no type</Text>;
  }
  if (message.structure.type === "assistantDb" && message.structure.sql) {
    return (
      <Box>
        <Box w={MESSAGE_CONTENT_WIDTH} mb="md">
          <Code block style={{ whiteSpace: "pre-wrap" }}>
            {message.structure.sql}
          </Code>
        </Box>
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
          deprecated
        </Box>
      </Box>
    );
  }
  if (
    message.structure.type === "assistantEcharts" &&
    message.structure.echartsOptions &&
    message.structure.warehouseId
  ) {
    return <Box>deprecated</Box>;
  }
  if (message.structure.type === "systemContent") {
    return <Text>{message.structure.content}</Text>;
  }
  if (message.structure.type === "userContent") {
    return <EditorJsonMarkdown>{message.structure.content}</EditorJsonMarkdown>;
  }
  if (message.structure.type === "assistantContent") {
    return <Text>{message.structure.content}</Text>;
  }
  if (message.structure.type === "systemDb") {
    return (
      <Box>
        <Text>
          I'm AI assistant, I can search the database for you. Please provide
          the question.
        </Text>
        <WarehouseCard warehouseId={message.structure.warehouseId} />
      </Box>
    );
  }
  if (message.structure.type === "systemEcharts") {
    return (
      <Text>
        I'm AI assistant, I can generate a chart with the data from the parent
        message. Please provide what type of chart you want to generate. For
        example, bar chart, pie chart.
      </Text>
    );
  }
  return null;
};
