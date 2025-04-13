"use client";

import {
  Box,
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getThreadList } from "../../../../../queries/thread";
import {
  MENUBAR_WIDTH,
  SIDEBAR_WIDTH,
} from "../../../../sidebar-width.constant";
import { MessageInput } from "./message-input";

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
    <Box style={{ position: "relative" }}>
      <Box flex={1} style={{ overflow: "hidden" }}>
        <Container size="sm" py="md">
          <Stack gap="xs">
            {threads.map((thread) => (
              <Paper
                key={thread.threadId}
                p="md"
                onClick={() => {
                  router.push(`/org/${orgId}/thread/${thread.threadId}`);
                }}
                withBorder
                style={{
                  cursor: "pointer",
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={6}>{thread.shortName}</Title>
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
          <Box
            style={{
              height: 200,
            }}
          />
        </Container>
      </Box>
      <Box
        style={{
          position: "fixed",
          width: `calc(100vw - ${SIDEBAR_WIDTH + MENUBAR_WIDTH}px)`,
          bottom: 0,
        }}
      >
        <Container size="sm" pb="sm">
          <MessageInput
            teamId={teamId}
            onSubmit={(threadId) => {
              router.push(`/org/${orgId}/thread/${threadId}`);
            }}
          />
        </Container>
      </Box>
    </Box>
  );
}
