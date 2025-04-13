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
import { getLlmList } from "../../../../../queries/llm";

export default function LlmSettingPage() {
  const { data, isLoading } = useQuery(getLlmList({}));
  const llms = data?.llms || [];

  return (
    <Container pt="xl">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={700}>AI models</Text>
        <Button component={Link} href="llm/create" size="xs">
          New AI model
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
                <Table.Th>Model</Table.Th>
                <Table.Th>Last updated</Table.Th>
                <Table.Th> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {llms.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center">No models added yet</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                llms.map((llm) => (
                  <Table.Tr key={llm.llmId}>
                    <Table.Td>{llm.name}</Table.Td>
                    <Table.Td>{llm.provider.provider}</Table.Td>
                    <Table.Td>{llm.provider.model}</Table.Td>
                    <Table.Td>{llm.updatedAt}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="white"
                          size="xs"
                          component={Link}
                          href={`llm/${llm.llmId}`}
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
