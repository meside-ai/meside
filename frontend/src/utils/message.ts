import type { MessageDto } from "@/queries/message";

export const getSystemMessage = (messages: MessageDto[]): MessageDto | null => {
  const systemMessagesOrderByCreatedAtAsc = messages
    .filter((message) => message.messageRole === "SYSTEM")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  if (systemMessagesOrderByCreatedAtAsc.length === 0) {
    return null;
  }

  return systemMessagesOrderByCreatedAtAsc[0];
};
