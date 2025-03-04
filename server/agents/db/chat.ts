import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import type { GetAssistantStructure } from "../types/chat.interface";
import {
  getAIResult,
  getMessagesPrompt,
  getSystemMessage,
} from "../utils/utils";
import {
  type AssistantDbMessageStructure,
  assistantDbMessageStructure,
} from "./type";

export const getAssistantDbStructure: GetAssistantStructure = async (body: {
  messages: MessageEntity[];
}) => {
  const systemMessage = getSystemMessage(body.messages);

  if (systemMessage.structure.type !== "systemDb") {
    throw new BadRequestError("System message is not a systemDb message");
  }

  const result = await getAIResult({
    messages: await getMessagesPrompt(body.messages),
    name: "sql",
    description: "get SQL query",
    structureSchema: assistantDbMessageStructure.pick({
      sql: true,
    }),
  });

  // TODO: retrieve the data structure from the database
  // to override the default data structure
  // implement in service layer, not in agent layer

  const structure: AssistantDbMessageStructure = {
    ...result.parsed,
    fields: [],
    type: "assistantDb",
    warehouseId: systemMessage.structure.warehouseId,
  };

  return {
    structure,
    llmRaw: result.llmRaw,
  };
};
