import { warehouseQueryColumnSchema } from "@/warehouse";
import { z } from "zod";

export const dbQuestionPayloadSchema = z.object({
  type: z.literal("db"),
  sql: z.string(),
  warehouseId: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
});

export type DbQuestionPayload = z.infer<typeof dbQuestionPayloadSchema>;

export const echartsQuestionPayloadSchema = z.object({
  type: z.literal("echarts"),
  warehouseId: z.string(),
  sql: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
  echartsOptions: z.string().describe("echarts options js code"),
});

export type EchartsQuestionPayload = z.infer<
  typeof echartsQuestionPayloadSchema
>;

export const questionPayloadSchema = z.union([
  dbQuestionPayloadSchema,
  echartsQuestionPayloadSchema,
]);

export type QuestionPayload = z.infer<typeof questionPayloadSchema>;
