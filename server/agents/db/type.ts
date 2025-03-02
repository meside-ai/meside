import { warehouseQueryColumnSchema } from "@/warehouse";
import { z } from "zod";

export const systemDbMessageStructure = z.object({
  type: z.literal("systemDb"),
  warehouseId: z.string(),
});

export type SystemDbMessageStructure = z.infer<typeof systemDbMessageStructure>;

export const assistantDbMessageStructure = z.object({
  type: z.literal("assistantDb"),
  warehouseId: z.string(),
  sql: z.string(),
  fields: z.array(warehouseQueryColumnSchema),
});

export type AssistantDbMessageStructure = z.infer<
  typeof assistantDbMessageStructure
>;
