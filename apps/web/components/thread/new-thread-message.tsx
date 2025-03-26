import { useChat } from "@ai-sdk/react";
import { Box } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { ThreadRender } from "./thread-render";

export const NewThreadMessage = ({
  threadId,
  userPrompt,
}: {
  threadId: string;
  userPrompt: string;
}) => {
  const [finished, setFinished] = useState(false);
  const [errored, setErrored] = useState(false);
  const mountedRef = useRef(false);
  const isLoading = useMemo(() => {
    return !finished || !errored;
  }, [finished, errored]);
  const api = "/meside/server/chat/stream";

  const { messages, input, setInput, handleSubmit, addToolResult } = useChat({
    api,
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

  useEffect(() => {
    if (finished) {
      console.log("finished");
    }
  }, [finished]);

  useEffect(() => {
    if (errored) {
      console.log("errored");
    }
  }, [errored]);

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
      <ThreadRender
        messages={messages}
        loading={isLoading}
        addToolResult={addToolResult}
      />
    </Box>
  );
};
