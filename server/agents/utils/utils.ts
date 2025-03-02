import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { ChatOpenAI } from "@langchain/openai";
import { getStructureContent } from "../agents";

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

export const getMessagesPrompt = async (
  messages: MessageEntity[],
): Promise<
  {
    role: "system" | "user" | "assistant";
    content: string;
  }[]
> => {
  return await Promise.all(
    messages.map(async (message) => {
      const getContent = getStructureContent(message);
      const data = await getContent({ message });
      return {
        role: convertMessageRole(message.messageRole),
        content: data.content,
      };
    }),
  );
};

export const getChatOpenAI = () => {
  return new ChatOpenAI({
    model: environment.AI_MODEL ?? "gpt-4o",
    temperature: 0,
    verbose: true,
    configuration: {
      baseURL: environment.AI_BASE_URL,
      apiKey: environment.AI_API_KEY,
    },
  });
};
