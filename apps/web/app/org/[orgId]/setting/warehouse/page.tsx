"use client";

import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Table,
  Text,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getWarehouseList } from "../../../../../queries/warehouse";

export default function WarehouseSettingPage() {
  const { data, isLoading } = useQuery(getWarehouseList({}));
  const warehouses = data?.warehouses || [];

  return (
    <Container pt="xl">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={700}>Databases</Text>
        <Button component={Link} href="warehouse/create" size="xs">
          New Database
        </Button>
      </Group>
      <Box>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Provider</Table.Th>
                <Table.Th>Last updated</Table.Th>
                <Table.Th> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {warehouses.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center">No warehouses added yet</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                warehouses.map((warehouse) => (
                  <Table.Tr key={warehouse.warehouseId}>
                    <Table.Td>{warehouse.name}</Table.Td>
                    <Table.Td>{warehouse.provider.type}</Table.Td>
                    <Table.Td>{warehouse.updatedAt}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="white"
                          size="xs"
                          component={Link}
                          href={`warehouse/${warehouse.warehouseId}`}
                        >
                          <IconPencil size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        )}
      </Box>
    </Container>
  );
}
