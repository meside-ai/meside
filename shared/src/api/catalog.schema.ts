import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const catalogDtoSchema = z.object({
  catalogId: z.string(),
  warehouseId: z.string(),
  warehouseType: z.string(),
  fullName: z.string(),
  schemaName: z.string(),
  tableName: z.string(),
  columnName: z.string(),
  columnType: z.string(),
  description: z.string().nullable(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  foreign: z
    .object({
      fullName: z.string(),
      schemaName: z.string(),
      tableName: z.string(),
      columnName: z.string(),
    })
    .optional(),
});

export type CatalogDto = z.infer<typeof catalogDtoSchema>;

// catalogLoad
export const catalogLoadRequestSchema = z.object({
  warehouseId: z.string(),
});

export const catalogLoadResponseSchema = z.object({});

export type CatalogLoadRequest = z.infer<typeof catalogLoadRequestSchema>;
export type CatalogLoadResponse = z.infer<typeof catalogLoadResponseSchema>;

export const catalogLoadRoute = createRoute({
  method: "post",
  path: "/load",
  request: {
    body: {
      content: {
        "application/json": {
          schema: catalogLoadRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: catalogLoadResponseSchema,
        },
      },
      description: "Load catalogs",
    },
  },
});

// catalogList
export const catalogListRequestSchema = z.object({
  warehouseId: z.string(),
});

export const catalogListResponseSchema = z.object({
  catalogs: z.array(catalogDtoSchema),
});

export type CatalogListRequest = z.infer<typeof catalogListRequestSchema>;
export type CatalogListResponse = z.infer<typeof catalogListResponseSchema>;

export const catalogListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: catalogListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: catalogListResponseSchema,
        },
      },
      description: "List catalogs",
    },
  },
});

// catalogSuggestion
export const catalogSuggestionRequestSchema = z.object({
  warehouseId: z.string(),
  keyword: z.string(),
});

export const catalogSuggestionResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
});

export type CatalogSuggestionRequest = z.infer<
  typeof catalogSuggestionRequestSchema
>;
export type CatalogSuggestionResponse = z.infer<
  typeof catalogSuggestionResponseSchema
>;

export const catalogSuggestionRoute = createRoute({
  method: "post",
  path: "/suggestion",
  request: {
    body: {
      content: {
        "application/json": {
          schema: catalogSuggestionRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: catalogSuggestionResponseSchema,
        },
      },
      description: "Suggest catalogs",
    },
  },
});
