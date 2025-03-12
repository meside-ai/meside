import { getLogger } from "@/logger";
import type { LanguageModelV1Middleware, LanguageModelV1StreamPart } from "ai";

const logger = getLogger("AILogMiddleware");

export const logMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    logger.info("doGenerate called");
    logger.info(`params: ${JSON.stringify(params, null, 2)}`);

    const result = await doGenerate();

    logger.info("doGenerate finished");
    logger.info(
      `generated text: ${result.text}, 💰💰💰 promptTokens: ${result.usage.promptTokens}, 💰💰💰 completionTokens: ${result.usage.completionTokens}`,
    );

    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    logger.info("doStream called");
    logger.info(`params: ${JSON.stringify(params, null, 2)}`);

    const { stream, ...rest } = await doStream();

    let generatedText = "";
    let promptTokens = 0;
    let completionTokens = 0;

    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
    >({
      transform(chunk, controller) {
        if (chunk.type === "text-delta") {
          generatedText += chunk.textDelta;
        }
        if (chunk.type === "finish") {
          promptTokens = chunk.usage.promptTokens;
          completionTokens = chunk.usage.completionTokens;
        }
        controller.enqueue(chunk);
      },

      flush() {
        logger.info("doStream finished");
        logger.info(
          `generated text: ${generatedText}, 💰💰💰 promptTokens: ${promptTokens}, 💰💰💰 completionTokens: ${completionTokens}`,
        );
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
