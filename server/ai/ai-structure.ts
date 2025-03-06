import { BadRequestError } from "@/utils/error";
import type { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { AICore, type AICoreInput } from "./ai-core";

export type AIStructureInput = {
  model: AICoreInput["model"];
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  schema: z.ZodSchema;
  schemaName: string;
  schemaDescription: string;
};

export type AIStructureOutput = {
  reason: string;
  text: string;
  promptTokens: number;
  completionTokens: number;
  structure: z.infer<AIStructureInput["schema"]> | null;
};

export class AIStructure {
  streamObject(input: AIStructureInput): ReadableStream<AIStructureOutput> {
    const prompt = getPromptWithSchema(
      input.messages,
      input.schema,
      input.schemaName,
    );

    const core = new AICore();
    const coreStream = core.stream({
      model: input.model,
      prompt,
    });

    const stream = new ReadableStream<AIStructureOutput>({
      async start(controller) {
        const reader = coreStream.getReader();
        const initial: AIStructureOutput = {
          reason: "",
          text: "",
          promptTokens: 0,
          completionTokens: 0,
          structure: null,
        };
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              const structure = extractStructureFromAICompletionText(
                initial.text,
                input.schema,
              );
              Object.assign(initial, {
                structure,
              });
              controller.enqueue(initial);
              controller.close();
              break;
            }
            Object.assign(initial, value);
            controller.enqueue(initial);
          }
        } finally {
          reader.releaseLock();
        }
      },
    });

    return stream;
  }
}

const extractStructureFromAICompletionText = (
  text: string,
  schema: z.ZodSchema,
): AIStructureOutput["structure"] | null => {
  const jsonText = text.match(/```json\n([\s\S]*)\n```/);
  if (!jsonText) {
    return null;
  }
  try {
    const json = JSON.parse(jsonText[1]);
    return schema.parse(json);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPromptWithSchema = (
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[],
  schema: z.ZodSchema,
  name: string,
): string => {
  const jsonSchema = zodToJsonSchema(schema, name);

  const formatInstructions = [
    "#Instructions: Respond only in valid JSON. The JSON object you return should match the following JSON Schema, return should be wrapped in ```json tags:",
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
