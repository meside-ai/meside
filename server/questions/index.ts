import { z } from "zod";

export const questionPayloadSchema = z.union([
  z.object({
    type: z.literal("db"),
  }),
  z.object({
    type: z.literal("echarts"),
  }),
]);

export type QuestionPayload = z.infer<typeof questionPayloadSchema>;
