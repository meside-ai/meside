import { z } from "zod";
import { warehouseProviderSchema } from "../warehouse/warehouse.type";

export const warehouseDtoSchema = z.object({
  warehouseId: z.string(),
  name: z.string(),
  provider: warehouseProviderSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type WarehouseDto = z.infer<typeof warehouseDtoSchema>;

// warehouseCreate
export const warehouseCreateRequestSchema = z.object({
  name: z.string(),
  provider: warehouseProviderSchema,
});

export const warehouseCreateResponseSchema = z.object({
  warehouseId: warehouseDtoSchema.shape.warehouseId,
});

export type WarehouseCreateRequest = z.infer<
  typeof warehouseCreateRequestSchema
>;
export type WarehouseCreateResponse = z.infer<
  typeof warehouseCreateResponseSchema
>;

// warehouseList
export const warehouseListRequestSchema = z.object({});

export const warehouseListResponseSchema = z.object({
  warehouses: z.array(warehouseDtoSchema),
});

export type WarehouseListRequest = z.infer<typeof warehouseListRequestSchema>;
export type WarehouseListResponse = z.infer<typeof warehouseListResponseSchema>;

// warehouseDetail
export const warehouseDetailRequestSchema = z.object({
  warehouseId: warehouseDtoSchema.shape.warehouseId,
});

export const warehouseDetailResponseSchema = z.object({
  warehouse: warehouseDtoSchema.nullable(),
});

export type WarehouseDetailRequest = z.infer<
  typeof warehouseDetailRequestSchema
>;
export type WarehouseDetailResponse = z.infer<
  typeof warehouseDetailResponseSchema
>;

// warehouseUpdate
export const warehouseUpdateRequestSchema = z.object({
  warehouseId: warehouseDtoSchema.shape.warehouseId,
  name: z.string().optional(),
  provider: warehouseProviderSchema.optional(),
});

export const warehouseUpdateResponseSchema = z.object({
  warehouseId: warehouseDtoSchema.shape.warehouseId,
});

export type WarehouseUpdateRequest = z.infer<
  typeof warehouseUpdateRequestSchema
>;
export type WarehouseUpdateResponse = z.infer<
  typeof warehouseUpdateResponseSchema
>;
