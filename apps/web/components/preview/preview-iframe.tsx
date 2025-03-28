import { Box } from "@mantine/core";
import { PREVIEW_URL_PREFIX } from "@meside/shared/constant/index";
import { useMemo } from "react";

export type PreviewIframeProps = {
  url: string;
};

export const PreviewIframe = ({ url }: PreviewIframeProps) => {
  const parsedUrl = useMemo(() => {
    if (url.startsWith(PREVIEW_URL_PREFIX)) {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    }
    return null;
  }, [url]);

  return (
    <Box
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      {parsedUrl && (
        <iframe
          src={parsedUrl}
          title="Preview content"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            overflow: "hidden",
          }}
        />
      )}
    </Box>
  );
};
