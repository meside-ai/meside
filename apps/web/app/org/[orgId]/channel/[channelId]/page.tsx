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
import { useParams, useRouter } from "next/navigation";
import { NewThreadInput } from "../../../../../components/thread/new-thread-input";
import { getThreadList } from "../../../../../queries/thread";

export default function ChannelPage() {
  return <ChannelContent />;
}

function ChannelContent() {
  const { orgId, channelId: teamId } = useParams<{
    orgId: string;
    channelId: string;
  }>();
  const { data, isLoading } = useQuery(getThreadList({ teamId }));
  const threads = data?.threads || [];
  const router = useRouter();

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

        <Box p="md">
          <NewThreadInput
            teamId={teamId}
            onSubmit={(threadId) => {
              router.push(`/org/${orgId}/thread/${threadId}`);
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
