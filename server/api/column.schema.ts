import { columnModelSchema } from "@/db/schema/column";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// columnLoad
export const columnLoadRequestSchema = z.object({
  warehouseId: z.string(),
});

export const columnLoadResponseSchema = z.object({});

export type ColumnLoadRequest = z.infer<typeof columnLoadRequestSchema>;
export type ColumnLoadResponse = z.infer<typeof columnLoadResponseSchema>;

export const columnLoadRoute = createRoute({
  method: "post",
  path: "/load",
  request: {
    body: {
      content: {
        "application/json": {
          schema: columnLoadRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: columnLoadResponseSchema,
        },
      },
      description: "Load columns",
    },
  },
});

// columnList
export const columnListRequestSchema = z.object({
  warehouseId: z.string(),
});

export const columnListResponseSchema = z.object({
  columns: z.array(columnModelSchema),
});

export type ColumnListRequest = z.infer<typeof columnListRequestSchema>;
export type ColumnListResponse = z.infer<typeof columnListResponseSchema>;

export const columnListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: columnListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: columnListResponseSchema,
        },
      },
      description: "List columns",
    },
  },
});

// columnSuggestion
export const columnSuggestionRequestSchema = z.object({
  warehouseId: z.string(),
  keyword: z.string(),
});

export const columnSuggestionResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
});

export type ColumnSuggestionRequest = z.infer<
  typeof columnSuggestionRequestSchema
>;
export type ColumnSuggestionResponse = z.infer<
  typeof columnSuggestionResponseSchema
>;

export const columnSuggestionRoute = createRoute({
  method: "post",
  path: "/suggestion",
  request: {
    body: {
      content: {
        "application/json": {
          schema: columnSuggestionRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: columnSuggestionResponseSchema,
        },
      },
      description: "Suggest columns",
    },
  },
});
