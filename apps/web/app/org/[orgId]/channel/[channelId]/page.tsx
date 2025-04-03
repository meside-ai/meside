"use client";

import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getThreadList } from "../../../../../queries/thread";

export default function ChannelPage() {
  return <ChannelContent />;
}

function ChannelContent() {
  const { data, isLoading } = useQuery(getThreadList({}));
  const threads = data?.threads || [];

  if (isLoading) {
    return (
      <Box>
        <Skeleton h={80} w="60%" />
        <Skeleton h={80} w="100%" />
        <Skeleton h={80} w="60%" />
      </Box>
    );
  }

  return (
    <Box flex={1} h="100%" style={{ overflow: "auto" }}>
      <Container py="xs">
        <Stack gap="xs">
          {threads.map((thread) => (
            <Paper key={thread.threadId} p="md" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={6}>{thread.shortName}</Title>
                  <Button
                    component={Link}
                    href={`/org/${thread.orgId}/thread/${thread.threadId}`}
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                  >
                    Review details
                  </Button>
                </Group>
              </Stack>
            </Paper>
          ))}
          {threads.length === 0 && (
            <Text ta="center" fs="italic" c="dimmed">
              No threads available
            </Text>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
