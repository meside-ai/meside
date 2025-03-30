"use client";
import "@mantine/core/styles.css";
import { Box } from "@mantine/core";
import { MenuPanel } from "../../../../components/chat/menu-panel";
import { ThreadProvider } from "../../../../components/chat/provider";
import { PreviewPanel } from "../../../../components/preview/preview-panel";
import { PreviewProvider } from "../../../../components/preview/preview-provider";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PreviewProvider>
      <ThreadProvider>
        <Box
          w="100vw"
          h="100vh"
          display="flex"
          style={{
            flexDirection: "column",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          <Box
            w="100%"
            display="flex"
            flex={1}
            style={{
              flexDirection: "row",
              overflow: "hidden",
            }}
          >
            <Box w={200} h="100%" style={{ overflow: "hidden" }}>
              <MenuPanel />
            </Box>
            <Box w={600} h="100%" style={{ overflow: "hidden" }}>
              {children}
            </Box>
            <Box flex={1} h="100%" style={{ overflow: "hidden" }} mr="md">
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </ThreadProvider>
    </PreviewProvider>
  );
}
