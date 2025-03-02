import { getThreadList } from "@/queries/thread";
import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  NavLink,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useChatContext } from "./context";

export const MenuPanel = () => {
  return (
    <Box
      h="100%"
      display="flex"
      style={{
        flexDirection: "column",
        overflow: "hidden",
        background: "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box style={{ overflow: "hidden" }} mb="lg">
        <StartPanel />
      </Box>
      <Box flex={1} style={{ overflow: "hidden" }}>
        <ThreadPanel />
      </Box>
      <Box mb="md">
        <MyProfile />
      </Box>
    </Box>
  );
};

const StartPanel = () => {
  const { setThreadId } = useChatContext();

  return (
    <Box mx="md" pt="md">
      <Title
        order={1}
        mb="md"
        style={{
          fontFamily: "Assistant",
          fontOpticalSizing: "auto",
          fontWeight: 500,
          fontStyle: "normal",
          color: "#fff",
          letterSpacing: "-0.5px",
        }}
      >
        meside
      </Title>
      <Button
        size="md"
        variant="light"
        onClick={() => {
          setThreadId(null);
        }}
        leftSection={<IconMessageCircle size={16} />}
      >
        New Chat
      </Button>
    </Box>
  );
};

export const ThreadPanel = () => {
  const { threadId: activeThreadId, setThreadId } = useChatContext();

  const { data } = useQuery(
    getThreadList({
      parentMessageId: null,
      createdAtSort: "desc",
    })
  );

  return (
    <Box style={{ height: "100%", overflow: "overflow" }}>
      <ScrollArea h="100%">
        <Box mx="md">
          {data?.threads.map((thread) => (
            <NavLink
              key={thread.threadId}
              active={thread.threadId === activeThreadId}
              label={thread.name}
              onClick={() => setThreadId(thread.threadId)}
              style={{
                borderRadius: 8,
              }}
            />
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );
};

const MyProfile = () => {
  return (
    <Box mx="md">
      <Card p="xs" style={{ cursor: "pointer" }}>
        <Group gap="xs">
          <Avatar size="sm">CW</Avatar>
          <Text size="sm">My profile</Text>
        </Group>
      </Card>
    </Box>
  );
};
