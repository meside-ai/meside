import { Box, NavLink } from "@mantine/core";
import { PreviewContent } from "./preview-content";
import { usePreviewContext } from "./preview-context";

export const PreviewPanel = () => {
  return (
    <Box
      display="flex"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <Box style={{ width: 100, overflow: "hidden" }}>
        <PreviewTabs />
      </Box>
      <Box flex={1} style={{ overflow: "hidden" }}>
        <PreviewContent />
      </Box>
    </Box>
  );
};

const PreviewTabs = () => {
  const { previews, activePreviewId, setActivePreviewId } = usePreviewContext();

  return (
    <Box>
      {previews.map((preview) => (
        <NavLink
          key={preview.previewId}
          active={preview.previewId === activePreviewId}
          label={preview.name}
          onClick={() => setActivePreviewId(preview.previewId)}
          style={{
            textWrap: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        />
      ))}
    </Box>
  );
};
