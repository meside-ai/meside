export type AddToolResult = ({
  toolCallId,
  result,
}: {
  toolCallId: string;
  result: string;
}) => void;
