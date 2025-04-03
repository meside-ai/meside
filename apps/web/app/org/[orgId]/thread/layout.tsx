"use client";
import "@mantine/core/styles.css";
import { Box, Button, Menu, Text, UnstyledButton } from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronDown,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useThreadContext } from "../../../../components/chat/context";
import { ThreadProvider } from "../../../../components/chat/provider";
import { PreviewPanel } from "../../../../components/preview/preview-panel";
import { PreviewProvider } from "../../../../components/preview/preview-provider";
import { getThreadDetail, getThreadList } from "../../../../queries/thread";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PreviewProvider>
      <ThreadProvider>
        <Box
          w="100vw"
          h="100vh"
          display="flex"
          style={{
            flexDirection: "column",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          <Box
            w="100%"
            display="flex"
            flex={1}
            style={{
              flexDirection: "row",
              overflow: "hidden",
            }}
          >
            <Box
              w={600}
              h="100%"
              display="flex"
              style={{ flexDirection: "column", overflow: "hidden" }}
            >
              <Box>
                <ThreadHeader />
              </Box>
              <Box style={{ flex: 1, overflow: "auto" }}>{children}</Box>
            </Box>
            <Box flex={1} h="100%" style={{ overflow: "hidden" }} mr="md">
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </ThreadProvider>
    </PreviewProvider>
  );
}

function ThreadHeader() {
  const { threadId } = useThreadContext();
  const params = useParams();
  const orgId = params.orgId as string;
  const teamId = params.teamId as string;

  const { data } = useQuery(getThreadDetail({ threadId: threadId ?? "" }));

  return (
    <Box
      p="md"
      style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <Button
        component={Link}
        href={`/org/${orgId}/channel`}
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mr="md"
      >
        Back
      </Button>

      <Menu shadow="md" width={220}>
        <Menu.Target>
          <UnstyledButton
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Text fw={600}>You are talking with Database Team</Text>
            <IconChevronDown size={16} />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <ThreadListMenu teamId={teamId} />
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}

const ThreadListMenu = ({ teamId }: { teamId: string }) => {
  const { data } = useQuery(getThreadList({}));
  const params = useParams();
  const orgId = params.orgId as string;

  return (
    <>
      {data?.threads.map((thread) => (
        <Menu.Item
          component={Link}
          href={`/org/${orgId}/thread/${thread.threadId}`}
          key={thread.threadId}
          leftSection={<IconMessageCircle size={16} />}
        >
          {thread.shortName}
        </Menu.Item>
      ))}
    </>
  );
};
