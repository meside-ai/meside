import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import type { GetAssistantStructure } from "../types/chat.interface";
import {
  getAIResult,
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

    const result = await getAIResult({
      messages: await getMessagesPrompt(body.messages),
      name: "echarts",
      description: "get echarts options",
      structureSchema: assistantEchartsMessageStructure.pick({
        echartsOptions: true,
      }),
    });

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
