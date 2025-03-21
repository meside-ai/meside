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

export const warehouseTypeSchema = z.enum([
  "postgresql",
  "bigquery",
  "mysql",
  "oracle",
]);

export type WarehouseType = z.infer<typeof warehouseTypeSchema>;

export const warehouseProviderSchema = z.union([
  z.object({
    type: z.literal("postgresql"),
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string(),
  }),
  z.object({
    type: z.literal("bigquery"),
    projectId: z.string(),
    credentials: z.string(),
  }),
]);

export type WarehouseProvider = z.infer<typeof warehouseProviderSchema>;
