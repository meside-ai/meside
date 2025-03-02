import { getThreadList } from "@/queries/thread";
import { Badge, Box, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export const MessageChildThreads = ({
  parentMessageId,
  threadId,
  setThreadId,
}: {
  parentMessageId: string;
  threadId: string;
  setThreadId: (threadId: string) => void;
}) => {
  const { data } = useQuery(
    getThreadList({
      parentMessageId,
      createdAtSort: "asc",
    })
  );

  if (!data || data.threads.length === 0) {
    return null;
  }
  return (
    <Box>
      <Title order={6} mb="xs">
        Related quotes:
      </Title>
      {data.threads.map((thread) => {
        return (
          <Badge
            key={thread.threadId}
            style={{ textTransform: "none", cursor: "pointer" }}
            onClick={() => setThreadId(thread.threadId)}
            color={thread.threadId === threadId ? "blue" : "gray"}
          >
            {thread.name || "Untitled sub thread"}
          </Badge>
        );
      })}
    </Box>
  );
};
