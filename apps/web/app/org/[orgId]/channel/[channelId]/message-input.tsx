"use client";

import { Paper } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { MessageInput as TiptapMessageInput } from "../../../../../components/message-input/message-input";
import { getThreadCreate } from "../../../../../queries/thread";

export const MessageInput = ({
  teamId,
  onSubmit,
}: {
  teamId: string;
  onSubmit: (threadId: string) => void;
}) => {
  const { mutateAsync: createNewThread, isPending } = useMutation(
    getThreadCreate(),
  );
  return (
    <Paper withBorder p="md" radius="lg">
      <TiptapMessageInput
        submit={async (input) => {
          const json = await createNewThread({
            teamId,
            versionId: null,
            systemPrompt: "",
            userPrompt: input,
            parentThreadId: null,
          });
          onSubmit(json.thread.threadId);
        }}
        placeholder="Create a new thread"
        loading={isPending}
      />
    </Paper>
  );
};
