import { BadRequestError } from "@/utils/error";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import { type LanguageModelV1, streamObject } from "ai";
import type { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { AICore } from "./ai-core";

export type AIStructureInput = {
  model: "gpt-4o" | "o1" | "deepseek-reasoner";
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
    switch (input.model) {
      case "gpt-4o":
      case "o1":
        return this.streamObjectStandard(input);
      case "deepseek-reasoner":
        return this.streamObjectCustom(input);
      default:
        throw new BadRequestError("Invalid model");
    }
  }

  streamObjectStandard(
    input: AIStructureInput,
  ): ReadableStream<AIStructureOutput> {
    const prompt = getPrompt(input.messages);

    const result = streamObject({
      model: getModel(input.model),
      prompt,
      schema: input.schema,
    });

    const stream = new ReadableStream<AIStructureOutput>({
      async start(controller) {
        const initial: AIStructureOutput = {
          reason: "",
          text: "",
          promptTokens: 0,
          completionTokens: 0,
          structure: null,
        };

        for await (const part of result.fullStream) {
          switch (part.type) {
            case "text-delta":
              Object.assign(initial, {
                text: initial.text + part.textDelta,
              });
              controller.enqueue(initial);
              break;
            case "object":
              console.log(part.object);
              Object.assign(initial, {
                structure: part.object,
              });
              controller.enqueue(initial);
              break;
            case "finish":
              Object.assign(initial, {
                promptTokens: part.usage.promptTokens,
                completionTokens: part.usage.completionTokens,
              });
              controller.enqueue(initial);
              break;
            case "error":
              controller.error(part.error);
              break;
          }
        }
        controller.close();
      },
    });

    return stream;
  }

  streamObjectCustom(
    input: AIStructureInput,
  ): ReadableStream<AIStructureOutput> {
    const prompt = getPromptWithSchema(
      input.messages,
      input.schema,
      input.schemaName,
    );

    const core = new AICore();
    const coreStream = core.stream({
      model: getModel(input.model),
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

const getModel = (model: AIStructureInput["model"]): LanguageModelV1 => {
  switch (model) {
    case "gpt-4o":
      return openai("gpt-4o");
    case "o1":
      return openai("o1");
    case "deepseek-reasoner":
      return deepseek("deepseek-reasoner");
  }
};

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

const getPrompt = (
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[],
): string => {
  const combinedContent = messages.reduce((acc, message) => {
    return `${acc}\n${message.content}`;
  }, "");

  return combinedContent;
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
