import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { GetAssistantStructure } from "../types/chat.interface";
import {
  getChatModel,
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

  const llm = getChatModel();

  const messagesPrompt = await getMessagesPrompt(body.messages);

  const prompt = ChatPromptTemplate.fromMessages(messagesPrompt, {
    templateFormat: "mustache",
  });

  const structureSchema = assistantDbMessageStructure.pick({
    sql: true,
    fields: true,
  });

  const chain = prompt.pipe(
    llm.withStructuredOutput(structureSchema, {
      includeRaw: true,
    }),
  );
  const result = await chain.invoke({});

  // TODO: retrieve the data structure from the database
  // to override the default data structure

  const structure: AssistantDbMessageStructure = {
    ...result.parsed,
    type: "assistantDb",
    warehouseId: systemMessage.structure.warehouseId,
  };

  return {
    structure,
  };
};
