"use client";

import { Container, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  getWarehouseDetail,
  getWarehouseList,
  getWarehouseUpdate,
} from "../../../../../../queries/warehouse";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function WarehouseDetailPage() {
  const { warehouse_id: warehouseId } = useParams<{ warehouse_id: string }>();
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { data } = useQuery(
    getWarehouseDetail({ warehouseId: warehouseId ?? "" }),
  );
  const warehouse = data?.warehouse;
  const { mutateAsync: updateWarehouse } = useMutation({
    ...getWarehouseUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getWarehouseList.name] });
      router.push(`/org/${orgId}/setting/warehouse`);
    },
  });

  return (
    <Container py="xl">
      <Title order={2} mb="md">
        Edit Database
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
