import { warehouseQueryColumnSchema } from "@/warehouse";
import { z } from "zod";

export const sqlQuestionPayloadSchema = z.object({
  type: z.literal("sql"),
  sql: z.string(),
  warehouseId: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
});

export type SqlQuestionPayload = z.infer<typeof sqlQuestionPayloadSchema>;

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

export const nameQuestionPayloadSchema = z.object({
  type: z.literal("name"),
  name: z.string(),
  minLength: z.number(),
  maxLength: z.number(),
});

export type NameQuestionPayload = z.infer<typeof nameQuestionPayloadSchema>;

export const contentQuestionPayloadSchema = z.object({
  type: z.literal("content"),
});

export type ContentQuestionPayload = z.infer<
  typeof contentQuestionPayloadSchema
>;

export const questionPayloadSchema = z.union([
  sqlQuestionPayloadSchema,
  echartsQuestionPayloadSchema,
  nameQuestionPayloadSchema,
  contentQuestionPayloadSchema,
]);

export type QuestionPayload = z.infer<typeof questionPayloadSchema>;
