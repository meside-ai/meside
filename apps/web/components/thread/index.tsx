import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getThreadDetail } from "../../queries/thread";
import { useThreadContext } from "../chat/context";
import { NewThreadInput } from "./new-thread-input";
import { NewThreadMessage } from "./new-thread-message";
import { ThreadRender } from "./thread-render";

export const Thread = () => {
  const { threadId, setThreadId } = useThreadContext();

  const { data, isLoading } = useQuery(
    getThreadDetail({ threadId: threadId ?? "" }),
  );

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!data?.thread) {
    return (
      <Box p="md">
        <NewThreadInput setThreadId={setThreadId} />
      </Box>
    );
  }

  if (data.thread.status === "idle" && data.thread.messages.length === 0) {
    return (
      <NewThreadMessage
        threadId={data.thread.threadId}
        userPrompt={data.thread.userPrompt}
      />
    );
  }

  if (data.thread.status === "active" || data.thread.status === "closed") {
    return (
      <Box style={{ height: "100%", overflow: "auto" }}>
        <ThreadRender messages={data.thread.messages} />
      </Box>
    );
  }

  return <Box>Unknown issue</Box>;
};
