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
  type AssistantContentMessageStructure,
  assistantContentMessageStructure,
} from "./type";

export const getAssistantContentStructure: GetAssistantStructure =
  async (body: {
    messages: MessageEntity[];
  }) => {
    const systemMessage = getSystemMessage(body.messages);

    if (systemMessage.structure.type !== "systemContent") {
      throw new BadRequestError(
        "System message is not a systemContent message",
      );
    }

    const llm = getChatModel();

    const messagesPrompt = await getMessagesPrompt(body.messages);

    const prompt = ChatPromptTemplate.fromMessages(messagesPrompt, {
      templateFormat: "mustache",
    });

    const structureSchema = assistantContentMessageStructure.pick({
      content: true,
    });

    const result = await getAIResult(
      {
        llm,
        prompt,
        name: "content",
        description: "get content",
        structureSchema,
      },
      {
        mode: environment.AI_MODE,
      },
    );

    const structure: AssistantContentMessageStructure = {
      ...result.parsed,
      type: "assistantContent",
    };

    return {
      structure,
      llmRaw: result.llmRaw,
    };
  };
