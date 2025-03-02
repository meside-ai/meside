import { warehouseQueryColumnSchema } from "@/warehouse";
import { z } from "zod";

export const systemEchartsMessageStructure = z.object({
  type: z.literal("systemEcharts"),
  warehouseId: z.string(),
  sql: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
});

export type SystemEchartsMessageStructure = z.infer<
  typeof systemEchartsMessageStructure
>;

export const assistantEchartsMessageStructure = z.object({
  type: z.literal("assistantEcharts"),
  warehouseId: z.string(),
  sql: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
  echartsOptions: z.string().describe("echarts options js code"),
});

export type AssistantEchartsMessageStructure = z.infer<
  typeof assistantEchartsMessageStructure
>;
