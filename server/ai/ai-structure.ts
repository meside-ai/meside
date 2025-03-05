import type { z } from "zod";
import { AICore, type AICoreInput } from "./ai-core";

export type AIStructureInput = {
  model: AICoreInput["model"];
  prompt: AICoreInput["prompt"];
  schema: z.ZodSchema;
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
    const core = new AICore();
    const coreStream = core.stream({
      model: input.model,
      prompt: input.prompt,
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
