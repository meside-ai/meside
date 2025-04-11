import { z } from "zod";

export const warehouseQueryColumnSchema = z.object({
  tableName: z.string(),
  columnName: z.string(),
  columnType: z.enum(["string", "number", "boolean", "date", "timestamp"]),
  description: z.string(),
});

export type WarehouseQueryColumn = z.infer<typeof warehouseQueryColumnSchema>;

export const warehouseQueryRowSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), z.any()),
    z.array(z.any()),
  ]),
);

export type WarehouseQueryRow = z.infer<typeof warehouseQueryRowSchema>;
