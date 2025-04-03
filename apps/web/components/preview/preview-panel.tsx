import { Box } from "@mantine/core";
import { usePreviewContext } from "./preview-context";
import { PreviewIframe } from "./preview-iframe";

export const PreviewPanel = () => {
  const { preview } = usePreviewContext();
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
      {preview?.type === "preview" && <PreviewIframe url={preview.value} />}
    </Box>
  );
};
