import { ScrollArea } from "@mantine/core";
import { TableView } from "../db/table-view";
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
    return (
      <ScrollArea w="100%" h="100%">
        <TableView messageId={preview.payload.messageId} />
      </ScrollArea>
    );
  }

  return "not built yet";
};
