import type { MessageEntity } from "@/db/schema/message";

export const getSystemMessage = (
  messages: MessageEntity[],
): MessageEntity | null => {
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
