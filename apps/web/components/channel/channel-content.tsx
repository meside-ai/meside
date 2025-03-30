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

// Demo data for threads (to be moved to a data file later)
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

interface ChannelContentProps {
  channelName: string;
}

export function ChannelContent({ channelName }: ChannelContentProps) {
  return (
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
                Summary: We've identified several performance bottlenecks in our
                database queries. The team has proposed index optimizations and
                query restructuring to improve response times.
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
  );
}
