import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import type { GetAssistantStructure } from "../types/chat.interface";
import {
  getAIResult,
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

  const result = await getAIResult({
    messages: await getMessagesPrompt(body.messages),
    name: "name",
    description: "get name",
    structureSchema: assistantNameMessageStructure.pick({
      name: true,
    }),
  });

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
