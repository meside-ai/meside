import type {
  LanguageModelV1,
  LanguageModelV1Middleware,
  LanguageModelV1StreamPart,
} from "ai";

import type { LlmDto } from "@meside/shared/api/llm.schema";

import { createOpenAI } from "@ai-sdk/openai";
import { wrapLanguageModel } from "ai";

export const getLlmModel = async (llm: LlmDto): Promise<LanguageModelV1> => {
  const llmModel = await getLlmModelCore(llm);

  const wrappedLanguageModel = wrapLanguageModel({
    model: llmModel,
    middleware: [llmLoggerMiddleware],
  });

  return wrappedLanguageModel;
};

const getLlmModelCore = async (llm: LlmDto): Promise<LanguageModelV1> => {
  if (llm.provider.provider === "openai") {
    const provider = createOpenAI({
      apiKey: llm.provider.apiKey,
    });

    return provider(llm.provider.model);
  }

  if (llm.provider.provider === "deepseek") {
    const provider = createOpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: llm.provider.apiKey,
    });

    return provider(llm.provider.model);
  }

  if (llm.provider.provider === "openaiCompatible") {
    const provider = createOpenAI({
      baseURL: llm.provider.baseUrl,
      apiKey: llm.provider.apiKey,
    });

    return provider(llm.provider.model);
  }

  throw new Error("Unsupported provider");
};

export const llmLoggerMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const result = await doGenerate();
    return result;
  },

  wrapStream: async ({ doStream, params }) => {
    const { stream, ...rest } = await doStream();

    let generatedText = "";

    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
    >({
      transform(chunk, controller) {
        if (chunk.type === "text-delta") {
          generatedText += chunk.textDelta;
        }

        controller.enqueue(chunk);
      },

      flush() {},
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
