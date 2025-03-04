import { TableVirtualView } from "../db/table-virtual-view";
import { WarehouseEditor } from "../warehouse/warehouse-editor";
import { usePreviewContext } from "./preview-context";
import type { PreviewEntity } from "./types";

export const PreviewContent = () => {
  const { preview } = usePreviewContext();

  if (!preview) {
    return null;
  }

  return <PreviewContentCore preview={preview} />;
};

const PreviewContentCore = ({ preview }: { preview: PreviewEntity }) => {
  if (preview.payload.type === "warehouseColumn") {
    return <WarehouseEditor warehouseId={preview.payload.warehouseId} />;
  }

  if (preview.payload.type === "warehouseTable") {
    return <TableVirtualView messageId={preview.payload.messageId} />;
  }

  return "not built yet";
};
