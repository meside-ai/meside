import { getLogger } from "@meside/shared/logger/index";
import { createDataStream, streamText } from "ai";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { getLlmModel } from "../service/ai";
import { getActiveLlm } from "../service/llm";
import { getThreadDetail } from "../service/thread";
import { getAuthOrUnauthorized } from "../utils/auth";

const logger = getLogger("completion");

export const completionApi = new Hono();

completionApi.post("/threadName", async (c) => {
  const { threadId } = (await c.req.json()) as {
    threadId: string;
  };

  const auth = getAuthOrUnauthorized(c);
  const thread = await getThreadDetail(threadId);

  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      const prompt = `
        # message history
        ${JSON.stringify(thread.messages)}
        `;

      const llm = await getActiveLlm({ orgId: auth.orgId });
      const model = await getLlmModel(llm);
      const aiStream = streamText({
        model,
        prompt,
        experimental_telemetry: { isEnabled: true },
      });
      aiStream.mergeIntoDataStream(dataStreamWriter);
    },
    onError: (error) => {
      logger.error("error", error);
      return error instanceof Error ? error.message : String(error);
    },
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");
  c.header("Content-Encoding", "none");
  c.header("Cache-Control", "no-cache");

  return stream(c, (stream) =>
    stream.pipe(dataStream.pipeThrough(new TextEncoderStream())),
  );
});
