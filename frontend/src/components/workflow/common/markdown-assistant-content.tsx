import { EditorJsonMarkdown } from "@/components/markdown/editor-json-markdown";
import { MESSAGE_CONTENT_WIDTH } from "@/utils/message-width";
import { Box } from "@mantine/core";

export type MarkdownAssistantContentProps = {
  assistantContent: string;
};

export const MarkdownAssistantContent = ({
  assistantContent,
}: MarkdownAssistantContentProps) => {
  return (
    <Box style={{ maxWidth: MESSAGE_CONTENT_WIDTH, overflow: "hidden" }}>
      <EditorJsonMarkdown>{assistantContent}</EditorJsonMarkdown>
    </Box>
  );
};
