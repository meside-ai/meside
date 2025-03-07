import type { MessageDto } from "@meside/api/message.schema";
import { StarterSystemDb } from "./starter-system-db";

type StarterPanelProps = {
  structureType: MessageDto["structure"]["type"];
  setThreadId: (threadId: string) => void;
};

export const StarterPanel = ({
  structureType,
  setThreadId,
}: StarterPanelProps) => {
  if (structureType === "systemDb") {
    return <StarterSystemDb setThreadId={setThreadId} />;
  }

  return "not built";
};
