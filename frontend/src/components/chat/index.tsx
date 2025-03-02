import { Box } from "@mantine/core";
import { PreviewPanel } from "../preview/preview-panel";
import { PreviewProvider } from "../preview/preview-provider";
import { MainChatPanel } from "./main-chat-panel";
import { MenuPanel } from "./menu-panel";
import { ChatProvider } from "./provider";
import { ThreadNameSubscription } from "./thread-name-subscription";

export const Chat = () => {
  return (
    <PreviewProvider>
      <ChatProvider>
        <ThreadNameSubscription />
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
              <MainChatPanel />
            </Box>
            <Box flex={1} h="100%" style={{ overflow: "hidden" }}>
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </ChatProvider>
    </PreviewProvider>
  );
};
