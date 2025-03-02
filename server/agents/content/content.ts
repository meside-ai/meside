import { BadRequestError } from "@/utils/error";
import type { GetContent } from "../types/content.interface";

export const getSystemContentMessageContent: GetContent = async ({
  message,
}) => {
  if (message.structure.type !== "systemContent") {
    throw new BadRequestError("System message is not a systemContent message");
  }

  const content = message.structure.content;

  return { content };
};

export const getUserContentMessageContent: GetContent = async ({ message }) => {
  if (message.structure.type !== "userContent") {
    throw new BadRequestError("User message is not a userContent message");
  }

  const content = message.structure.content;

  return { content };
};

export const getAssistantContentMessageContent: GetContent = async ({
  message,
}) => {
  if (message.structure.type !== "assistantContent") {
    throw new BadRequestError(
      "Assistant message is not a assistantContent message",
    );
  }

  const content = message.structure.content;

  return { content };
};
