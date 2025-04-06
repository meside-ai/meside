"use client";

import { Box } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import {
  getWarehouseCreate,
  getWarehouseList,
} from "../../../../queries/warehouse";
import { queryClient } from "../../../../utils/query-client";
import { Form } from "../form";

export const dynamic = "force-static";

export default function WarehouseSettingPage() {
  const { mutateAsync: createWarehouse } = useMutation({
    ...getWarehouseCreate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getWarehouseList.name] });
    },
  });

  return (
    <Box>
      <Form
        onSubmit={async (data) => {
          await createWarehouse(data);
        }}
      />
    </Box>
  );
}
