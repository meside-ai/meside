import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { userDtoSchema } from "./user.schema";
import {
  warehouseQueryColumnSchema,
  warehouseQueryRowSchema,
  warehouseTypeSchema,
} from "./warehouse.type";

export const warehouseDtoSchema = z.object({
  warehouseId: z.string(),
  name: z.string(),
  type: warehouseTypeSchema,
  host: z.string(),
  port: z.number(),
  username: z.string(),
  database: z.string(),
  schema: z.string().nullable(),
  ownerId: z.string(),
  orgId: z.string(),
  owner: userDtoSchema.optional(),
});

export type WarehouseDto = z.infer<typeof warehouseDtoSchema>;

// warehouseCreate
export const warehouseCreateRequestSchema = z.object({
  name: z.string(),
  type: warehouseDtoSchema.shape.type,
  host: z.string(),
  port: z.number(),
  database: z.string(),
  username: z.string(),
  password: z.string(),
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

export const warehouseCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseCreateResponseSchema,
        },
      },
      description: "Create the warehouse",
    },
  },
});

// warehouseList
export const warehouseListRequestSchema = z.object({});

export const warehouseListResponseSchema = z.object({
  warehouses: z.array(warehouseDtoSchema),
});

export type WarehouseListRequest = z.infer<typeof warehouseListRequestSchema>;
export type WarehouseListResponse = z.infer<typeof warehouseListResponseSchema>;

export const warehouseListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseListResponseSchema,
        },
      },
      description: "Retrieve the warehouse list",
    },
  },
});

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

export const warehouseDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseDetailResponseSchema,
        },
      },
      description: "Retrieve the warehouse detail",
    },
  },
});

// warehouseExecute
export const warehouseExecuteRequestSchema = z.object({
  questionId: z.string(),
});

export const warehouseExecuteResponseSchema = z.object({
  fields: z.array(warehouseQueryColumnSchema),
  rows: z.array(warehouseQueryRowSchema),
});

export type WarehouseExecuteRequest = z.infer<
  typeof warehouseExecuteRequestSchema
>;
export type WarehouseExecuteResponse = z.infer<
  typeof warehouseExecuteResponseSchema
>;

export const warehouseExecuteRoute = createRoute({
  method: "post",
  path: "/execute",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseExecuteRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseExecuteResponseSchema,
        },
      },
      description: "Execute the warehouse",
    },
  },
});

// warehouseTable
export const warehouseTableRequestSchema = z.object({
  tableName: z.string(),
  warehouseId: z.string(),
  limit: z.number().optional().default(500),
});

export const warehouseTableResponseSchema = z.object({
  fields: z.array(warehouseQueryColumnSchema),
  rows: z.array(warehouseQueryRowSchema),
});

export type WarehouseTableRequest = z.infer<typeof warehouseTableRequestSchema>;
export type WarehouseTableResponse = z.infer<
  typeof warehouseTableResponseSchema
>;

export const warehouseTableRoute = createRoute({
  method: "post",
  path: "/table",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseTableRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseTableResponseSchema,
        },
      },
      description: "Retrieve the warehouse table",
    },
  },
});
