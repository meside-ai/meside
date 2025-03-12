import { BadRequestError } from "@/utils/error";
import type { z } from "zod";
import { AICore } from "./ai-core";
import { getModel } from "./ai-model";
import type { AIStructureInput } from "./ai-structure";

export type AITextInput = Omit<
  AIStructureInput,
  "schema" | "schemaName" | "schemaDescription"
>;

export type AITextOutput = {
  reason: string;
  text: string;
  promptTokens: number;
  completionTokens: number;
  structure: z.infer<AIStructureInput["schema"]> | null;
};

export class AIText {
  streamObject(input: AITextInput): ReadableStream<AITextOutput> {
    switch (input.model) {
      case "gpt-4o":
      case "o1":
      case "deepseek-reasoner":
        return this.streamText(input);
      default:
        throw new BadRequestError("Invalid model");
    }
  }

  streamText(input: AITextInput): ReadableStream<AITextOutput> {
    const core = new AICore();
    const coreStream = core.stream({
      model: getModel(input.model),
      prompt: input.prompt,
    });

    const stream = new ReadableStream<AITextOutput>({
      async start(controller) {
        const reader = coreStream.getReader();
        const initial: AITextOutput = {
          reason: "",
          text: "",
          promptTokens: 0,
          completionTokens: 0,
          structure: {},
        };
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
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
