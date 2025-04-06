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
import { getTeamDetail } from "../../queries/team";
import { getThreadDetail, getThreadList } from "../../queries/thread";
import { useThreadContext } from "../thread-context/context";

export const ThreadHeader = () => {
  const { threadId } = useThreadContext();
  const params = useParams();
  const orgId = params.orgId as string;

  const { data } = useQuery(getThreadDetail({ threadId: threadId ?? "" }));

  return (
    <Box
      p="md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <Button
        component={Link}
        href={
          data?.thread?.teamId
            ? `/org/${orgId}/channel/${data?.thread?.teamId}`
            : `/org/${orgId}/channel`
        }
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mr="md"
      >
        Back
      </Button>

      {data?.thread?.teamId && (
        <Menu shadow="md" width={220}>
          <Menu.Target>
            <UnstyledButton
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ThreadListTitle teamId={data.thread.teamId} />
              <IconChevronDown size={16} />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <ThreadListMenu teamId={data.thread.teamId} />
          </Menu.Dropdown>
        </Menu>
      )}
    </Box>
  );
};

const ThreadListTitle = ({ teamId }: { teamId: string }) => {
  const { data } = useQuery(getTeamDetail({ teamId }));
  return <Text fw={600}>You are talking with {data?.team?.name}</Text>;
};

const ThreadListMenu = ({ teamId }: { teamId: string }) => {
  const { data } = useQuery(getThreadList({ teamId }));
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
