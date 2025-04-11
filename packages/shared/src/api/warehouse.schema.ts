import { z } from "zod";
import { userDtoSchema } from "./user.schema";

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

// main
export const warehouseDtoSchema = z.object({
  warehouseId: z.string(),
  name: z.string(),
  provider: warehouseProviderSchema,
  ownerId: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  owner: userDtoSchema.optional(),
});

export type WarehouseDto = z.infer<typeof warehouseDtoSchema>;
