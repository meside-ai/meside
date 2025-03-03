import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
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

    const result = await getAIResult(
      {
        llm: getChatModel(),
        messages: await getMessagesPrompt(body.messages),
        name: "content",
        description: "get content",
        structureSchema: assistantContentMessageStructure.pick({
          content: true,
        }),
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
