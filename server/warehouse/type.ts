import { z } from "zod";

export const warehouseQueryColumnSchema = z.object({
  tableName: z.string(),
  columnName: z.string(),
  columnType: z.enum([
    "text",
    "integer",
    "float",
    "boolean",
    "date",
    "datetime",
    "unknown",
  ]),
  description: z.string(),
});

export type WarehouseQueryColumn = z.infer<typeof warehouseQueryColumnSchema>;

export const warehouseQueryRowSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export type WarehouseQueryRow = z.infer<typeof warehouseQueryRowSchema>;
