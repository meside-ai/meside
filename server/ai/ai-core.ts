import { type LanguageModelV1, streamText } from "ai";

export type AICoreInput = {
  model: LanguageModelV1;
  prompt: string;
};

export type AICoreOutput = {
  reason: string;
  text: string;
  promptTokens: number;
  completionTokens: number;
};

export class AICore {
  stream(input: AICoreInput): ReadableStream<AICoreOutput> {
    const result = streamText({
      model: input.model,
      prompt: input.prompt,
    });

    const stream = new ReadableStream<AICoreOutput>({
      async start(controller) {
        const initial: AICoreOutput = {
          reason: "",
          text: "",
          promptTokens: 0,
          completionTokens: 0,
        };

        for await (const part of result.fullStream) {
          switch (part.type) {
            case "text-delta":
              controller.enqueue(
                Object.assign(initial, {
                  text: initial.text + part.textDelta,
                }),
              );
              break;
            case "reasoning":
              controller.enqueue(
                Object.assign(initial, {
                  reason: initial.reason + part.textDelta,
                }),
              );
              break;
            case "finish":
              controller.enqueue(
                Object.assign(initial, {
                  promptTokens: part.usage.promptTokens,
                  completionTokens: part.usage.completionTokens,
                }),
              );
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
}
