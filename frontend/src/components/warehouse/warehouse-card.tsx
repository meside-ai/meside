import { getWarehouseDetail } from "@/queries/warehouse";
import { Box, Button, Card, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { usePreviewContext } from "../preview/preview-context";
import { WarehouseTitle } from "./warehouse-title";

export type WarehouseCardProps = {
  warehouseId: string;
};

export const WarehouseCard = ({ warehouseId }: WarehouseCardProps) => {
  const { openPreview } = usePreviewContext();

  const { data } = useQuery(
    getWarehouseDetail({
      warehouseId,
    })
  );

  return (
    <Card>
      {!data?.warehouse ? (
        <Skeleton height={100} />
      ) : (
        <>
          <Box mb="md">
            <WarehouseTitle warehouseId={warehouseId} />
          </Box>
          <Button
            size="xs"
            variant="light"
            onClick={() => {
              openPreview({
                name: "Warehouse",
                payload: { type: "previewWarehouse", warehouseId },
              });
            }}
          >
            View
          </Button>
        </>
      )}
    </Card>
  );
};
