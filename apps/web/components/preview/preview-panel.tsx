import { Box } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { extractMarkdownLinks } from "../../utils/markdown";
import { useChatContext } from "../chat-context/context";
import { PreviewContent } from "./preview-content";
import { PreviewSlider } from "./preview-slider";
import type { PreviewItem } from "./preview-type";

export const PreviewPanel = () => {
  const { chat } = useChatContext();
  const { messages } = chat;

  const previewItems = useMemo<PreviewItem[]>(() => {
    const previews: PreviewItem[] = [];
    for (const message of messages) {
      for (const part of message.parts) {
        if (part.type === "text") {
          const links = extractMarkdownLinks(part.text);
          for (const link of links) {
            if (!previews.some((p) => p.text === link)) {
              previews.push({
                type: "link",
                text: link,
                id: `${message.id}-${link}`,
              });
            }
          }
        }
      }
    }
    return previews;
  }, [messages]);

  const [activePreviewItem, setActivePreviewItem] =
    useState<PreviewItem | null>(null);

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
