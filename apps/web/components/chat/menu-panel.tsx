import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getThreadList } from "../../queries/thread";
import { Logo } from "../brand/logo";
import { useThreadContext } from "./context";

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
  const { setThreadId } = useThreadContext();

  return (
    <Box
      mx="md"
      pt="md"
      display="flex"
      style={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      <Logo />
      <Button
        size="md"
        onClick={() => {
          setThreadId(null);
        }}
        variant="light"
        leftSection={<IconMessageCircle size={16} />}
      >
        New Chat
      </Button>
    </Box>
  );
};

export const ThreadPanel = () => {
  const { threadId: activeThreadId, setThreadId } = useThreadContext();

  const { data } = useQuery(getThreadList({}));

  return (
    <Box style={{ height: "100%", overflow: "overflow" }}>
      <ScrollArea h="100%" scrollbars="y">
        <Box mx="md">
          {data?.threads.map((thread) => (
            <UnstyledButton
              key={thread.threadId}
              bg={thread.threadId === activeThreadId ? "dark.5" : undefined}
              c={thread.threadId === activeThreadId ? "white" : undefined}
              fz={14}
              px="md"
              py="xs"
              onClick={() => setThreadId(thread.threadId)}
              style={() => ({
                display: "block",
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 200 - 16 * 2,
              })}
            >
              {thread.shortName}
            </UnstyledButton>
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );
};

const MyProfile = () => {
  const navigate = useRouter();
  return (
    <Box mx="md">
      <Card
        p="xs"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate.push("/setting/warehouse");
        }}
      >
        <Group gap="xs">
          <Avatar size="sm" color="blue">
            CW
          </Avatar>
          <Text size="sm">My profile</Text>
        </Group>
      </Card>
    </Box>
  );
};
