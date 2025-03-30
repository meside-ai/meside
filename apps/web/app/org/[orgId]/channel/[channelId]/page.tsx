"use client";

import { Box } from "@mantine/core";
import { ChannelContent } from "../../../../../components/channel/channel-content";
import { ChannelSidebar } from "../../../../../components/channel/channel-sidebar";

export default function ChannelPage() {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      style={{
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <ChannelSidebar />
      <ChannelContent />
    </Box>
  );
}
