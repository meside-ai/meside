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

    const llm = getChatModel();

    const messagesPrompt = await getMessagesPrompt(body.messages);

    const prompt = ChatPromptTemplate.fromMessages(messagesPrompt, {
      templateFormat: "mustache",
    });

    const structureSchema = assistantEchartsMessageStructure.pick({
      echartsOptions: true,
    });

    const result = await getAIResult(
      {
        llm,
        prompt,
        name: "echarts",
        description: "get echarts options",
        structureSchema,
      },
      {
        mode: environment.AI_MODE,
      },
    );

    const structure: AssistantEchartsMessageStructure = {
      ...result.parsed,
      type: "assistantEcharts",
      warehouseId: systemMessage.structure.warehouseId,
      sql: systemMessage.structure.sql,
      fields: systemMessage.structure.fields,
    };

    return {
      structure,
      llmRaw: result.llmRaw,
    };
  };
