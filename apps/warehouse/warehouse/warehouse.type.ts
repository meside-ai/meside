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

export const warehouseProviderSchema = z.union([
  z.object({
    type: z.literal("postgresql"),
    host: z.string(),
    port: z.number().default(5432),
    username: z.string(),
    password: z.string().optional(),
    database: z.string(),
  }),
  z.object({
    type: z.literal("bigquery"),
    projectId: z.string(),
    credentials: z.string().optional(),
  }),
  z.object({
    type: z.literal("mysql"),
    host: z.string(),
    port: z.number().default(3306),
    username: z.string(),
    password: z.string().optional(),
    database: z.string(),
  }),
  z.object({
    type: z.literal("oracle"),
    host: z.string(),
    port: z.number().default(1521),
    username: z.string(),
    password: z.string().optional(),
    database: z.string(),
  }),
]);

export type WarehouseProvider = z.infer<typeof warehouseProviderSchema>;
