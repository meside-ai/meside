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
import { getTeamList } from "../../../../../queries/team";

export default function TeamSettingPage() {
  const { data, isLoading } = useQuery(getTeamList({}));
  const teams = data?.teams || [];

  return (
    <Container pt="xl">
      <Group justify="space-between" align="center" mb="md">
        <Text fw={700}>Teams</Text>
        <Button component={Link} href="team/create" size="xs">
          New Team
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
                <Table.Th>Description</Table.Th>
                <Table.Th>Last updated</Table.Th>
                <Table.Th> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {teams.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center">No teams added yet</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                teams.map((team) => (
                  <Table.Tr key={team.teamId}>
                    <Table.Td>{team.name}</Table.Td>
                    <Table.Td>{team.description}</Table.Td>
                    <Table.Td>{team.updatedAt}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="white"
                          size="xs"
                          component={Link}
                          href={`team/${team.teamId}`}
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
