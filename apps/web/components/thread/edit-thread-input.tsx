import { Box, Button, Loader, Paper } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { ThreadInput } from "./thread-input";
import { useThreadContext } from "../chat/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getThreadCreate, getThreadDetail } from "../../queries/thread";

export type EditThreadInputProps = {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

export const EditThreadInput = ({ setIsEditing }: EditThreadInputProps) => {
  const { threadId, setThreadId } = useThreadContext();
  const { mutateAsync: createNewThread } = useMutation(getThreadCreate());
  const { data } = useQuery(getThreadDetail({ threadId: threadId ?? "" }));

  if (!data?.thread) {
    return <Loader variant="dots" />;
  }

  return (
    <Paper withBorder p="md" radius="lg">
      <ThreadInput
        defaultValue={data.thread.userPrompt}
        handleSubmit={async (userInput) => {
          if (!data?.thread) {
            return;
          }
          const json = await createNewThread({
            versionId: data.thread.versionId,
            systemPrompt: data.thread.systemPrompt,
            userPrompt: userInput,
            parentThreadId: data.thread.threadId,
          });
          setThreadId(json.thread.threadId);
        }}
        placeholder="Create a new thread"
        buttons={
          <Button
            size="xs"
            onClick={() => setIsEditing(false)}
            leftSection={<IconX size={14} />}
          >
            Cancel
          </Button>
        }
      />
    </Paper>
  );
};
