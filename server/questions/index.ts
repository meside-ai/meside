import { warehouseQueryColumnSchema } from "@/warehouse";
import { z } from "zod";

export const questionPayloadSchema = z.union([
  z.object({
    type: z.literal("db"),
    sql: z.string(),
    warehouseId: z.string(),
    fields: z.array(warehouseQueryColumnSchema),
  }),
  z.object({
    type: z.literal("echarts"),
  }),
]);

export type QuestionPayload = z.infer<typeof questionPayloadSchema>;
