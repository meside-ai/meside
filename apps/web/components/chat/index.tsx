import { Box } from "@mantine/core";
import { PreviewPanel } from "../preview/preview-panel";
import { PreviewProvider } from "../preview/preview-provider";
import { MenuPanel } from "./menu-panel";
import { ThreadProvider } from "./provider";
import { Thread } from "../thread";

export const Chat = () => {
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
              <Thread />
            </Box>
            <Box flex={1} h="100%" style={{ overflow: "hidden" }} mr="md">
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </ThreadProvider>
    </PreviewProvider>
  );
};
