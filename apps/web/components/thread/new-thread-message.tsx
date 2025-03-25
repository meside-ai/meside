import { useChat } from "@ai-sdk/react";
import { Box } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { getThreadDetail, getThreadUpdate } from "../../queries/thread";
import { ThreadRender } from "./thread-render";

export const NewThreadMessage = ({
  threadId,
  userPrompt,
}: {
  threadId: string;
  userPrompt: string;
}) => {
  const queryClient = useQueryClient();
  const [finished, setFinished] = useState(false);
  const [errored, setErrored] = useState(false);
  const mountedRef = useRef(false);
  const isLoading = useMemo(() => {
    return !finished || !errored;
  }, [finished, errored]);

  const { messages, input, setInput, handleSubmit } = useChat({
    api: "/meside/server/chat/stream",
    body: {
      threadId,
    },
    onError: () => {
      setErrored(true);
    },
    onFinish: async () => {
      setFinished(true);
    },
  });

  const { mutateAsync: updateThread } = useMutation({
    ...getThreadUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries(getThreadDetail({ threadId }));
    },
  });

  useEffect(() => {
    if (finished) {
      updateThread({
        threadId,
        status: "active",
        messages,
      });
    }
  }, [finished, threadId, messages, updateThread]);

  useEffect(() => {
    if (errored) {
      updateThread({
        threadId,
        status: "closed",
        messages,
      });
    }
  }, [errored, threadId, messages, updateThread]);

  useEffect(() => {
    if (mountedRef.current) {
      return;
    }
    setInput(userPrompt);
    mountedRef.current = true;
  }, [setInput, userPrompt]);

  const mountedRef2 = useRef(false);

  useEffect(() => {
    if (mountedRef2.current) {
      return;
    }
    if (input) {
      handleSubmit();
      mountedRef2.current = true;
    }
  }, [input, handleSubmit]);

  return (
    <Box style={{ height: "100%", overflow: "auto" }}>
      <ThreadRender messages={messages} loading={isLoading} />
    </Box>
  );
};
