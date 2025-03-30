"use client";

import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight, IconSearch, IconUser } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { Logo } from "../../../../components/brand/logo";

// Demo data for channels
const CHANNELS = [
  { id: "database", name: "Database team" },
  { id: "jira", name: "Jira team" },
  { id: "support", name: "Support team" },
];

// Demo data for threads
const THREADS = [
  {
    id: "perf-opt",
    title: "Database Performance Optimization",
    summary:
      "We've identified several performance bottlenecks in our database queries. The team has proposed index optimizations and query restructuring to improve response times.",
    type: "performance",
  },
  {
    id: "schema-migration",
    title: "Schema Migration Plan",
    summary:
      "The team has finalized the schema migration plan for the upcoming release. This includes new tables for user preferences and improved relationship modeling.",
    type: "schema",
  },
  {
    id: "backup-strategy",
    title: "Backup Strategy Review",
    summary:
      "Regular evaluation of our backup approach to ensure data integrity and recoverability in case of system failures.",
    type: "backup",
  },
];

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;

  // Find the current channel with a default fallback
  const currentChannel =
    CHANNELS.find((channel) => channel.id === channelId) || CHANNELS[0];

  // Ensure we always have a valid channel
  const channelName = currentChannel?.name || "Team Channel";

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      style={{
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* Left sidebar */}
      <Box
        w={250}
        h="100%"
        style={{
          overflow: "hidden",
          background: "rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px 0",
        }}
      >
        <Stack gap="lg" px="md">
          <Logo />
          <Text fw={700} size="sm" c="dimmed" mt="md">
            AI TEAMS
          </Text>

          {/* Channel list */}
          <Stack gap="xs">
            {CHANNELS.map((channel) => (
              <Button
                key={channel.id}
                variant={channel.id === channelId ? "light" : "subtle"}
                color={channel.id === channelId ? "blue" : "gray"}
                fullWidth
                justify="start"
                radius="md"
                size="md"
                leftSection={
                  <Box
                    w={24}
                    display="flex"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text>💬</Text>
                  </Box>
                }
              >
                {channel.name}
              </Button>
            ))}
          </Stack>
        </Stack>

        {/* User profile section */}
        <Box px="md">
          <Paper p="xs" radius="md" withBorder style={{ cursor: "pointer" }}>
            <Group justify="space-between">
              <Group gap="xs">
                <Box
                  w={32}
                  h={32}
                  style={{
                    borderRadius: "50%",
                    background: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="sm">JD</Text>
                </Box>
                <Text size="sm">John Doe</Text>
              </Group>
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                p={0}
                style={{ width: 24, height: 24 }}
              >
                ⚙️
              </Button>
            </Group>
          </Paper>
        </Box>
      </Box>

      {/* Right content area */}
      <Box flex={1} h="100%" style={{ overflow: "auto" }}>
        {/* Channel header */}
        <Box
          w="100%"
          h={60}
          px="xl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e9ecef",
          }}
        >
          <Title order={3}>{channelName}</Title>
          <Group>
            <Button variant="subtle" leftSection={<IconUser size={16} />}>
              Members
            </Button>
            <Button variant="subtle" leftSection={<IconSearch size={16} />}>
              Search
            </Button>
          </Group>
        </Box>

        {/* Thread cards */}
        <Container size="xl" py="xl">
          <Stack gap="xl">
            {/* Performance Optimization Card */}
            <Paper p="xl" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4}>Database Performance Optimization</Title>
                  <Button
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                  >
                    Review details
                  </Button>
                </Group>
                <Text size="sm" color="dimmed">
                  Summary: We've identified several performance bottlenecks in
                  our database queries. The team has proposed index
                  optimizations and query restructuring to improve response
                  times.
                </Text>
                <Paper p="lg" radius="md" bg="rgba(0, 0, 0, 0.03)">
                  <Text ta="center" fw={500}>
                    Performance Chart
                  </Text>
                </Paper>
                <Group gap="xs">
                  <Text size="xs" fw={500}>
                    A
                  </Text>
                  <Text size="xs" fw={500}>
                    B
                  </Text>
                  <Text size="xs" fw={500}>
                    C
                  </Text>
                </Group>
              </Stack>
            </Paper>

            {/* Schema Migration Card */}
            <Paper p="xl" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4}>Schema Migration Plan</Title>
                  <Button
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                  >
                    Review details
                  </Button>
                </Group>
                <Text size="sm" color="dimmed">
                  Summary: The team has finalized the schema migration plan for
                  the upcoming release. This includes new tables for user
                  preferences and improved relationship modeling.
                </Text>
                <Group grow>
                  <Paper p="lg" radius="md" bg="rgba(0, 0, 0, 0.03)">
                    <Text ta="center" fw={500}>
                      Current Schema
                    </Text>
                  </Paper>
                  <Paper p="lg" radius="md" bg="rgba(0, 0, 0, 0.03)">
                    <Text ta="center" fw={500}>
                      New Schema
                    </Text>
                  </Paper>
                </Group>
                <Group gap="xs">
                  <Text size="xs" fw={500}>
                    D
                  </Text>
                  <Text size="xs" fw={500}>
                    E
                  </Text>
                </Group>
              </Stack>
            </Paper>

            {/* Backup Strategy Card */}
            <Paper p="xl" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4}>Backup Strategy Review</Title>
                  <Button
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                  >
                    Review details
                  </Button>
                </Group>
                <Text size="sm" color="dimmed">
                  Summary: Regular evaluation of our backup approach to ensure
                  data integrity and recoverability in case of system failures.
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
