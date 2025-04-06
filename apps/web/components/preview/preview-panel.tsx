import { Box } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { extractMarkdownLinks } from "../../utils/markdown";
import { composePreviewLink, useChatContext } from "../chat-context/context";
import type { PreviewItem } from "../chat-context/context";
import { PreviewContent } from "./preview-content";
import { PreviewSlider } from "./preview-slider";

export const PreviewPanel = () => {
  const { chat, activePreviewItem, setActivePreviewItem } = useChatContext();
  const { messages } = chat;

  const previewItems = useMemo<PreviewItem[]>(() => {
    const previews: PreviewItem[] = [];
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === "text") {
          const links = extractMarkdownLinks(part.text);
          for (const link of links) {
            const previewItem = composePreviewLink(link);
            if (!previews.some((p) => p.id === previewItem.id)) {
              previews.push(previewItem);
            }
          }
        }
      }
    }
    return previews;
  }, [messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (activePreviewItem === null) {
      const lastPreviewItem = previewItems[previewItems.length - 1];
      if (lastPreviewItem) {
        setActivePreviewItem(lastPreviewItem);
      }
    }
  }, [activePreviewItem, previewItems]);

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
      <Box style={{ flex: 1, overflow: "hidden" }} pt="md">
        {activePreviewItem && <PreviewContent item={activePreviewItem} />}
      </Box>
      <Box mr="md" pb="md">
        <PreviewSlider
          value={activePreviewItem}
          onChange={setActivePreviewItem}
          previewItems={previewItems}
        />
      </Box>
    </Box>
  );
};
