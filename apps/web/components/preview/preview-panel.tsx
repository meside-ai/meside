import { Box } from "@mantine/core";
import { useMemo } from "react";
import { extractMarkdownLinks } from "../../utils/markdown";
import { useChatContext } from "../chat-context/context";

export const PreviewPanel = () => {
  const { chat } = useChatContext();
  const { messages } = chat;

  const previewTexts = useMemo(() => {
    const previews: {
      type: "link";
      text: string;
    }[] = [];
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === "text") {
          const links = extractMarkdownLinks(part.text);
          for (const link of links) {
            if (!previews.some((p) => p.text === link)) {
              previews.push({
                type: "link",
                text: link,
              });
            }
          }
        }
      }
    }
    return previews;
  }, [messages]);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box>top</Box>
      <Box>bottom</Box>
    </Box>
  );
};
