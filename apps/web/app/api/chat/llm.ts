import { createOpenAI } from "@ai-sdk/openai";
import type { LlmDto } from "@meside/shared/api/llm.schema";
import type { LanguageModelV1 } from "ai";

export const getLlmModel = async (llm: LlmDto): Promise<LanguageModelV1> => {
  if (llm.provider.provider === "openai") {
    const provider = createOpenAI({
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
