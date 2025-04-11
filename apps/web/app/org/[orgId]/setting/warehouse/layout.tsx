"use client";

import { Box, Button, NavLink } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getWarehouseList } from "../../../../../queries/warehouse";

export default function WarehouseLayout({
  children,
}: { children: React.ReactNode }) {
  const { orgId } = useParams<{ orgId: string }>();
  const { data } = useQuery(getWarehouseList({}));
  const warehouses = data?.warehouses;

  return (
    <Box>
      <Box p="md">
        <Box>
          {warehouses?.map((warehouse) => (
            <NavLink
              key={warehouse.warehouseId}
              component={Link}
              href={`/org/${orgId}/setting/warehouse/${warehouse.warehouseId}`}
              label={warehouse.name}
              variant="filled"
            />
          ))}
        </Box>
        <Box>
          <Button
            component={Link}
            href={`/org/${orgId}/setting/warehouse/create`}
          >
            Add warehouse
          </Button>
        </Box>
      </Box>

      <Box>{children}</Box>
    </Box>
  );
}
