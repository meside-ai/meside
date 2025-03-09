import { getWarehouseDetail } from "@/queries/warehouse";
import { Button, Card, Skeleton, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { usePreviewContext } from "../preview/preview-context";

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
          <Text>{data.warehouse.name}</Text>
          <Text>{data.warehouse.type}</Text>
          <Text>
            {data.warehouse.host}:{data.warehouse.port}
          </Text>
          <Text>{data.warehouse.database}</Text>
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
