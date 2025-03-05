import {
  type AssistantDbMessageStructure,
  assistantDbMessageStructure,
} from "@/agents/db";
import { getMessagesPrompt } from "@/agents/utils/utils";
import { getSystemMessage } from "@/agents/utils/utils";
import { AIStructure } from "@/ai/ai-structure";
import type { MessageDto } from "@/api/message.schema";
import type { MessageEntity } from "@/db/schema/message";
import { cuid } from "@/utils/cuid";
import { BadRequestError } from "@/utils/error";
import type { ZodSchema } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export type StreamSqlGenerationMessage = Omit<MessageDto, "structure"> & {
  structure: AssistantDbMessageStructure;
};

export const streamSqlGeneration = async (body: {
  messages: MessageEntity[];
}): Promise<ReadableStream<StreamSqlGenerationMessage>> => {
  const systemMessage = getSystemMessage(body.messages);

  if (systemMessage.structure.type !== "systemDb") {
    throw new BadRequestError("System message is not a systemDb message");
  }

  const ai = new AIStructure();

  const schema = assistantDbMessageStructure.pick({
    sql: true,
  });

  const name = "sql";

  const prompt = getPrompt(
    await getMessagesPrompt(body.messages),
    schema,
    name,
  );

  const aiStream = ai.streamObject({
    model: "deepseek-reasoner",
    prompt,
    schema,
  });

  const stream = new ReadableStream<StreamSqlGenerationMessage>({
    async start(controller) {
      const reader = aiStream.getReader();
      if (systemMessage.structure.type !== "systemDb") {
        throw new BadRequestError("System message is not a systemDb message");
      }
      const initial: StreamSqlGenerationMessage = {
        messageId: cuid(),
        threadId: systemMessage.threadId,
        ownerId: systemMessage.ownerId,
        orgId: systemMessage.orgId,
        messageRole: "ASSISTANT",
        reason: "",
        text: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        structure: {
          type: "assistantDb",
          warehouseId: systemMessage.structure.warehouseId,
          sql: "",
          fields: [],
        },
      };
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          Object.assign(initial, {
            reason: value.reason,
            text: value.text,
          });
          Object.assign(
            initial.structure,
            value.structure ? value.structure : {},
          );
          controller.enqueue(initial);
        }
      } finally {
        reader.releaseLock();
      }
    },
  });

  return stream;
};

const getPrompt = (
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[],
  schema: ZodSchema,
  name: string,
): string => {
  const jsonSchema = zodToJsonSchema(schema, name);

  const formatInstructions = [
    "#Instructions: Respond only in valid JSON. The JSON object you return should match the following JSON Schema:",
    JSON.stringify(jsonSchema, null, 2),
  ].join("\n");

  const systemMessage = messages.find((message) => message.role === "system");

  if (!systemMessage) {
    throw new BadRequestError("System message not found");
  }

  const combinedContent = [
    {
      role: "user",
      content: `${systemMessage.content}\n${formatInstructions}`,
    },
    ...messages.filter((message) => message.role !== "system"),
  ].reduce((acc, message) => {
    return `${acc}\n${message.content}`;
  }, "");

  return combinedContent;
};
