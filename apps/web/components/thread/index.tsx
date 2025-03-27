import { Box, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getThreadDetail } from "../../queries/thread";
import { useThreadContext } from "../chat/context";
import { NewThreadInput } from "./new-thread-input";
import { NewThreadMessage } from "./new-thread-message";

export const Thread = () => {
  const { threadId, setThreadId } = useThreadContext();

  const { data, isLoading } = useQuery(
    getThreadDetail({ threadId: threadId ?? "" }),
  );

  if (isLoading) {
    return (
      <Box p="md">
        <Skeleton height={30} mb="md" />
        <Skeleton height={30} width="80%" mb="md" />
        <Skeleton height={30} width="60%" mb="md" />
      </Box>
    );
  }

  if (!data?.thread) {
    return (
      <Box p="md">
        <NewThreadInput setThreadId={setThreadId} />
      </Box>
    );
  }

  return (
    <NewThreadMessage
      threadId={data?.thread.threadId}
      threadMessages={data?.thread.messages ?? []}
    />
  );
};
