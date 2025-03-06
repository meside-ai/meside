import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";

export const convertMessageRole = (
  role: MessageEntity["messageRole"],
): "system" | "user" | "assistant" => {
  switch (role) {
    case "SYSTEM":
      return "system";
    case "USER":
    case "ASSISTANT":
      return "assistant";
  }
};

export const getSystemMessage = (messages: MessageEntity[]): MessageEntity => {
  const systemMessage = messages
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .find((message) => message.messageRole === "SYSTEM");
  if (!systemMessage) {
    throw new BadRequestError("System message not found");
  }
  return systemMessage;
};
