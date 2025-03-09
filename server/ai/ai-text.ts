import { BadRequestError } from "@/utils/error";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";
import type { z } from "zod";
import { AICore } from "./ai-core";
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
    const prompt = getPrompt(input.messages);

    const core = new AICore();
    const coreStream = core.stream({
      model: getModel(input.model),
      prompt,
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

const getModel = (model: AITextInput["model"]): LanguageModelV1 => {
  switch (model) {
    case "gpt-4o":
      return openai("gpt-4o");
    case "o1":
      return openai("o1");
    case "deepseek-reasoner":
      return deepseek("deepseek-reasoner");
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
