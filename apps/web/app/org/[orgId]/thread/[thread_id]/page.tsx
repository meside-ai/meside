"use client";

import { Box } from "@mantine/core";
import { ThreadProvider } from "../../../../../components/thread-context/provider";
import { ThreadLoad } from "../../../../../components/thread/thread-load";
import { SIDEBAR_WIDTH } from "../../../../sidebar-width.constant";

export default function ChatPage() {
  return (
    <Box
      style={{
        height: "100vh",
        overflow: "hidden",
        paddingLeft: SIDEBAR_WIDTH,
      }}
    >
      <ThreadProvider>
        <ThreadLoad />
      </ThreadProvider>
    </Box>
  );
}
