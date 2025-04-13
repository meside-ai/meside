"use client";

import { Container, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getWarehouseDetail,
  getWarehouseList,
  getWarehouseUpdate,
} from "../../../../../../queries/warehouse";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function WarehouseDetailPage() {
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
    <Container pt="xl">
      <Title order={2} mb="md">
        Edit Warehouse
      </Title>
      <Form
        initialData={warehouse ? warehouse : undefined}
        onSubmit={async (data) => {
          warehouseId &&
            (await updateWarehouse({
              warehouseId,
              ...data,
            }));
        }}
      />
    </Container>
  );
}
