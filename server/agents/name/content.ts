import { BadRequestError } from "@/utils/error";
import type { GetContent } from "../types/content.interface";

export const getSystemNameMessageContent: GetContent = async ({ message }) => {
  if (message.structure.type !== "systemName") {
    throw new BadRequestError("System message is not a systemName message");
  }

  const content = `summary for the thread based on the messages
  min length of name is ${message.structure.minLength}
  max length of name is ${message.structure.maxLength}`;

  return {
    content,
  };
};

export const getAssistantNameMessageContent: GetContent = async ({
  message,
}) => {
  if (message.structure.type !== "assistantName") {
    throw new BadRequestError(
      "Assistant message is not a assistantName message",
    );
  }

  const content = message.structure.name;

  return {
    content,
  };
};
