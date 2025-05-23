import { PreviewPanel } from "../preview/preview-panel";

import { ThreadHeader } from "./thread-header";

import { Box, ScrollArea } from "@mantine/core";
import type { ThreadDto } from "@meside/shared/api/thread.schema";
import { useCallback, useRef } from "react";
import { ChatProvider } from "../chat-context/provider";
import { MessageInput } from "./message-input";
import { ThreadMessage } from "./thread-message";

export const ThreadLayout = ({ thread }: { thread: ThreadDto }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <ChatProvider
      threadId={thread.threadId}
      threadMessages={thread.messages}
      scrollToBottom={scrollToBottom}
    >
      <Box
        display="flex"
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            width: 500,
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box style={{ flexShrink: 0 }}>
            <ThreadHeader />
          </Box>
          <Box style={{ flex: 1, flexShrink: 1, overflow: "hidden" }}>
            <ScrollArea h="100%" scrollbars="y" ref={scrollRef}>
              <Box p="md">
                <ThreadMessage />
              </Box>
            </ScrollArea>
          </Box>
          <Box style={{ flexShrink: 0 }} px="md" pb="md">
            <MessageInput />
          </Box>
        </Box>
        <Box
          style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <PreviewPanel />
        </Box>
      </Box>
    </ChatProvider>
  );
};
