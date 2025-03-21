import type { PreviewEntity } from "./types";

export const getPreviewId = (
  preview: Pick<PreviewEntity, "type" | "value">,
) => {
  return `${preview.type}-${preview.value}`;
};
