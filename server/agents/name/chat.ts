import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { GetAssistantStructure } from "../types/chat.interface";
import {
  getAIResult,
  getChatModel,
  getMessagesPrompt,
  getSystemMessage,
} from "../utils/utils";
import {
  type AssistantNameMessageStructure,
  assistantNameMessageStructure,
} from "./type";

export const getAssistantNameStructure: GetAssistantStructure = async (body: {
  messages: MessageEntity[];
}) => {
  const systemMessage = getSystemMessage(body.messages);

  if (systemMessage.structure.type !== "systemName") {
    throw new BadRequestError("System message is not a systemName message");
  }

  const llm = getChatModel();

  const messagesPrompt = await getMessagesPrompt(body.messages);

  const prompt = ChatPromptTemplate.fromMessages(messagesPrompt, {
    templateFormat: "mustache",
  });

  const structureSchema = assistantNameMessageStructure.pick({
    name: true,
  });

  const result = await getAIResult(
    {
      llm,
      prompt,
      name: "name",
      description: "get name",
      structureSchema,
    },
    {
      mode: environment.AI_MODE,
    },
  );

  const structure: AssistantNameMessageStructure = {
    ...result.parsed,
    type: "assistantName",
    threadId: systemMessage.structure.threadId,
  };

  return {
    structure,
    llmRaw: result.llmRaw,
  };
};
