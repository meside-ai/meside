import { Box, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getThreadDetail } from "../../queries/thread";
import { useThreadContext } from "../thread-context/context";
import { ThreadLayout } from "./thread-layout";

export const ThreadLoad = () => {
  const { threadId } = useThreadContext();

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
    return <Box>No thread data</Box>;
  }

  return <ThreadLayout thread={data.thread} />;
};
