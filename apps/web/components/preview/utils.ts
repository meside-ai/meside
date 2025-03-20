import type { PreviewEntity } from "./types";

export const getPreviewId = (preview: Pick<PreviewEntity, "payload">) => {
  return preview.payload.type;
};
