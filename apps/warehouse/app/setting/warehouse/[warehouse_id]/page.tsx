"use client";

import { Box } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getWarehouseDetail,
  getWarehouseList,
  getWarehouseUpdate,
} from "../../../../queries/warehouse";
import { queryClient } from "../../../../utils/query-client";
import { Form } from "../form";

export default function WarehouseSettingPage() {
  const { warehouse_id: warehouseId } = useParams<{ warehouse_id: string }>();
  const { data } = useQuery(
    getWarehouseDetail({ warehouseId: warehouseId ?? "" }),
  );
  const warehouse = data?.warehouse;
  const { mutateAsync: updateWarehouse } = useMutation({
    ...getWarehouseUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getWarehouseList.name] });
    },
  });

  return (
    <Box>
      <Form
        initialData={warehouse ? warehouse : undefined}
        onSubmit={async (data) => {
          warehouseId &&
            (await updateWarehouse({
              warehouseId: warehouseId,
              ...data,
            }));
        }}
      />
    </Box>
  );
}
