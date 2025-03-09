import { WarehouseEditor } from "../warehouse/warehouse-editor";
import { EchartsLazyLoader } from "../workflow/echarts/echarts-lazy-loader";
import { TableVirtualView } from "../workflow/sql/table-virtual-view";
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

  if (preview.payload.type === "db") {
    return <TableVirtualView questionId={preview.payload.questionId} />;
  }

  if (preview.payload.type === "echarts") {
    return <EchartsLazyLoader questionId={preview.payload.questionId} />;
  }

  return "not built yet";
};
