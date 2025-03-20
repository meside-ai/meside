import { z } from "zod";
import { warehouseQueryColumnSchema } from "./warehouse.type";

export const sqlQuestionPayloadSchema = z.object({
  type: z.literal("sql"),
  sql: z.string(),
  warehouseId: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
});

export type SqlQuestionPayload = z.infer<typeof sqlQuestionPayloadSchema>;

export const relationQuestionPayloadSchema = z.object({
  type: z.literal("relation"),
  warehouseId: z.string(),
});

export type RelationQuestionPayload = z.infer<
  typeof relationQuestionPayloadSchema
>;

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

export const labelQuestionPayloadSchema = z.object({
  type: z.literal("label"),
  warehouseId: z.string(),
});

export type LabelQuestionPayload = z.infer<typeof labelQuestionPayloadSchema>;

export const questionPayloadSchema = z.union([
  sqlQuestionPayloadSchema,
  relationQuestionPayloadSchema,
  echartsQuestionPayloadSchema,
  nameQuestionPayloadSchema,
  contentQuestionPayloadSchema,
  labelQuestionPayloadSchema,
]);

export type QuestionPayload = z.infer<typeof questionPayloadSchema>;
