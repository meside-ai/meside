import { BadRequestError } from "@/utils/error";
import { streamObject } from "ai";
import type { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { AICore } from "./ai-core";
import { type SupportedModel, getModel } from "./ai-model";

export type AIStructureInput = {
  model: SupportedModel;
  prompt: string;
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

  async generate(input: AIStructureInput): Promise<AIStructureOutput> {
    const aiStream = this.streamObject(input);

    const reader = aiStream.getReader();
    let initial: AIStructureOutput | null = null;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (initial === null) {
          initial = value;
        } else {
          Object.assign(initial, value);
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (initial === null) {
      throw new Error("Initial message not found");
    }

    return initial;
  }

  streamObjectStandard(
    input: AIStructureInput,
  ): ReadableStream<AIStructureOutput> {
    const prompt = input.prompt;

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
      input.prompt,
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
  prompt: string,
  schema: z.ZodSchema,
  name: string,
): string => {
  const jsonSchema = zodToJsonSchema(schema, name);

  const formatInstructions = [
    "#Instructions: Respond only in valid JSON. The JSON object you return should match the following JSON Schema, return should be wrapped in ```json tags:",
    JSON.stringify(jsonSchema, null, 2),
  ].join("\n");

  return `${prompt}\n${formatInstructions}`;
};
