import { environment } from "@/configs/environment";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import { type LanguageModelV1, wrapLanguageModel } from "ai";
import { logMiddleware } from "./ai-logger";

export type SupportedModel = "gpt-4o" | "o1" | "o3-mini" | "deepseek-reasoner";

export const getModel = (model?: SupportedModel): LanguageModelV1 => {
  const defaultModel = model ? model : environment.AI_MODEL;
  const wrappedLanguageModel = wrapLanguageModel({
    model: getPureModel(defaultModel),
    middleware: [logMiddleware],
  });
  return wrappedLanguageModel;
};

const getPureModel = (model: SupportedModel): LanguageModelV1 => {
  switch (model) {
    case "gpt-4o":
      return openai("gpt-4o");
    case "o1":
      return openai("o1");
    case "o3-mini":
      return openai("o3-mini");
    case "deepseek-reasoner": {
      return deepseek("deepseek-reasoner");
    }
  }
};
