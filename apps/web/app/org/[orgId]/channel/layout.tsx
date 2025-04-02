"use client";

import { Box } from "@mantine/core";
import type { ReactNode } from "react";
import { ChannelSidebar } from "../../../../components/channel/channel-sidebar";

interface ChannelLayoutProps {
  children: ReactNode;
}

export default function ChannelLayout({ children }: ChannelLayoutProps) {
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
      {children}
    </Box>
  );
}
