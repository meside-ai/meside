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
import { getToolList } from "../../../../../queries/tool";

export default function ToolSettingPage() {
  const { data, isLoading } = useQuery(getToolList({}));
  const tools = data?.tools || [];

  return (
    <Container pt="xl">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={700}>AI Tools</Text>
        <Button component={Link} href="tool/create" size="xs">
          New Tool
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
              {tools.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center">No tools added yet</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                tools.map((tool) => (
                  <Table.Tr key={tool.toolId}>
                    <Table.Td>{tool.name}</Table.Td>
                    <Table.Td>{tool.provider.provider}</Table.Td>
                    <Table.Td>{tool.updatedAt}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="white"
                          size="xs"
                          component={Link}
                          href={`tool/${tool.toolId}`}
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
