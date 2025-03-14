import { CatalogTable } from "../warehouse/catalog-table";
import { usePreviewContext } from "./preview-context";
import { PreviewQuestion } from "./preview-question";
import type { PreviewEntity } from "./types";

export const PreviewContent = () => {
  const { preview } = usePreviewContext();

  if (!preview) {
    return null;
  }

  return <PreviewContentCore preview={preview} />;
};

const PreviewContentCore = ({ preview }: { preview: PreviewEntity }) => {
  if (preview.payload.type === "previewWarehouse") {
    return <CatalogTable warehouseId={preview.payload.warehouseId} />;
  }

  if (preview.payload.type === "previewQuestion") {
    return <PreviewQuestion questionId={preview.payload.questionId} />;
  }

  return "not built yet";
};
