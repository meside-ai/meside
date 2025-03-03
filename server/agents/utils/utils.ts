import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import type { BaseMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatOpenAI } from "@langchain/openai";
import { getStructureContent } from "../agents";
import type { LLMRaw } from "../types/chat.interface";

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

export const getChatModel = () => {
  const model = environment.AI_MODEL ?? "gpt-4o";
  const verbose = environment.NODE_ENV === "development";

  if (["deepseek-reasoner", "deepseek-chat"].includes(model)) {
    return new ChatDeepSeek({
      // ChatDeepSeek does not support AI_BASE_URL
      // Langchain ChatOpenAI does not support deepseek well, due to function calling
      // add pull request to langchain to support AI_BASE_URL
      // @see https://github.com/langchain-ai/langchainjs/blob/0d6b66c007580272117397fcb06d9bb2559d3100/libs/langchain-deepseek/src/chat_models.ts#L404
      apiKey: environment.AI_API_KEY,
      model,
      temperature: 0,
      verbose,
    });
  }

  return new ChatOpenAI({
    model,
    temperature: 0,
    verbose,
    configuration: {
      baseURL: environment.AI_BASE_URL,
      apiKey: environment.AI_API_KEY,
    },
  });
};

export const extractLLMRaw = (raw: BaseMessage): LLMRaw => {
  const input = raw.response_metadata.tokenUsage.promptTokens;
  const output = raw.response_metadata.tokenUsage.completionTokens;
  const model = raw.response_metadata.model_name;
  const finishReason = raw.response_metadata.finish_reason;

  return {
    input,
    output,
    model,
    finishReason,
  };
};
