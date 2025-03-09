import { Box, Tabs, Text } from "@mantine/core";
import { PreviewContent } from "./preview-content";
import { usePreviewContext } from "./preview-context";

export const PreviewPanel = () => {
  return (
    <Box
      display="flex"
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      py="sm"
    >
      <Box style={{ overflow: "hidden" }} mb="sm">
        <PreviewTabs />
      </Box>
      <Box
        flex={1}
        style={() => ({
          overflow: "hidden",
        })}
      >
        <PreviewContent />
      </Box>
    </Box>
  );
};

const PreviewTabs = () => {
  const { previews, activePreviewId, setActivePreviewId } = usePreviewContext();

  return (
    <Box>
      <Tabs
        variant="pills"
        value={activePreviewId}
        onChange={setActivePreviewId}
      >
        <Tabs.List>
          {previews.map((preview) => (
            <Tabs.Tab key={preview.previewId} value={preview.previewId}>
              <Text
                size="xs"
                style={{
                  maxWidth: 100,
                  textWrap: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  m: 0,
                  p: 0,
                }}
              >
                {preview.name}
              </Text>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Box>
  );
};
