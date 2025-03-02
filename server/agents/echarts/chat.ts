import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { GetAssistantStructure } from "../types/chat.interface";
import {
  getChatOpenAI,
  getMessagesPrompt,
  getSystemMessage,
} from "../utils/utils";
import {
  type AssistantEchartsMessageStructure,
  assistantEchartsMessageStructure,
} from "./type";

export const getAssistantEchartsStructure: GetAssistantStructure =
  async (body: {
    messages: MessageEntity[];
  }) => {
    const systemMessage = getSystemMessage(body.messages);

    if (systemMessage.structure.type !== "systemEcharts") {
      throw new BadRequestError(
        "System message is not a systemEcharts message",
      );
    }

    const llm = getChatOpenAI();

    const messagesPrompt = await getMessagesPrompt(body.messages);

    const prompt = ChatPromptTemplate.fromMessages(messagesPrompt, {
      templateFormat: "mustache",
    });

    const structureSchema = assistantEchartsMessageStructure.pick({
      echartsOptions: true,
    });

    const chain = prompt.pipe(
      llm.withStructuredOutput(structureSchema, {
        includeRaw: true,
      }),
    );
    const result = await chain.invoke({});

    const structure: AssistantEchartsMessageStructure = {
      ...result.parsed,
      type: "assistantEcharts",
      warehouseId: systemMessage.structure.warehouseId,
      sql: systemMessage.structure.sql,
      fields: systemMessage.structure.fields,
    };

    return {
      structure,
    };
  };
