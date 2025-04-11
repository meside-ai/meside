import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { userDtoSchema } from "./user.schema";

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
  warehouseId: z.string(),
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

// warehouseCreate
export const warehouseCreateRequestSchema = z.object({
  name: z.string(),
  provider: warehouseProviderSchema,
});

export const warehouseCreateResponseSchema = z.object({
  warehouseId: z.string(),
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

// warehouseUpdate
export const warehouseUpdateRequestSchema = z.object({
  warehouseId: z.string(),
  name: z.string().optional(),
  provider: warehouseProviderSchema.optional(),
});

export const warehouseUpdateResponseSchema = z.object({});

export type WarehouseUpdateRequest = z.infer<
  typeof warehouseUpdateRequestSchema
>;
export type WarehouseUpdateResponse = z.infer<
  typeof warehouseUpdateResponseSchema
>;

export const warehouseUpdateRoute = createRoute({
  method: "post",
  path: "/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseUpdateResponseSchema,
        },
      },
      description: "Update the warehouse",
    },
  },
});

// warehouseGetQuery
export const warehouseGetQueryRequestSchema = z.object({
  queryId: z.string(),
});

export const warehouseGetQueryResponseSchema = z.object({
  sql: z.string(),
});

export type WarehouseGetQueryRequest = z.infer<
  typeof warehouseGetQueryRequestSchema
>;
export type WarehouseGetQueryResponse = z.infer<
  typeof warehouseGetQueryResponseSchema
>;

export const warehouseGetQueryRoute = createRoute({
  method: "post",
  path: "/get-query",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseGetQueryRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseGetQueryResponseSchema,
        },
      },
      description: "Get the warehouse query",
    },
  },
});

// warehouseExecuteQuery
export const warehouseExecuteQueryRequestSchema = z.object({
  queryId: z.string(),
});

export const warehouseExecuteQueryResponseSchema = z.object({
  rows: z.array(warehouseQueryRowSchema),
  fields: z.array(warehouseQueryColumnSchema),
});

export type WarehouseExecuteQueryRequest = z.infer<
  typeof warehouseExecuteQueryRequestSchema
>;
export type WarehouseExecuteQueryResponse = z.infer<
  typeof warehouseExecuteQueryResponseSchema
>;

export const warehouseExecuteQueryRoute = createRoute({
  method: "post",
  path: "/execute-query",
  request: {
    body: {
      content: {
        "application/json": {
          schema: warehouseExecuteQueryRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: warehouseExecuteQueryResponseSchema,
        },
      },
      description: "Execute the warehouse query",
    },
  },
});
