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

    const llm = getChatOpenAI();

    const messagesPrompt = await getMessagesPrompt(body.messages);

    const prompt = ChatPromptTemplate.fromMessages(messagesPrompt, {
      templateFormat: "mustache",
    });

    const structureSchema = assistantContentMessageStructure.pick({
      content: true,
    });

    const chain = prompt.pipe(
      llm.withStructuredOutput(structureSchema, {
        includeRaw: true,
      }),
    );
    const result = await chain.invoke({});

    const structure: AssistantContentMessageStructure = {
      ...result.parsed,
      type: "assistantContent",
    };

    return {
      structure,
    };
  };
