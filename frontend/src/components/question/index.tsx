import { Box } from "@mantine/core";
import { PreviewPanel } from "../preview/preview-panel";
import { PreviewProvider } from "../preview/preview-provider";
import { MainChatPanel } from "./main-chat-panel";
import { MenuPanel } from "./menu-panel";
import { QuestionProvider } from "./provider";

export const Question = () => {
  return (
    <PreviewProvider>
      <QuestionProvider>
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
            <Box flex={1} h="100%" style={{ overflow: "hidden" }} mr="md">
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </QuestionProvider>
    </PreviewProvider>
  );
};
