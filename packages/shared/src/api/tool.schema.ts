import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const toolProviderSchema = z.object({
  provider: z.literal("mcpSse"),
  configs: z.object({
    type: z.literal("sse"),
    url: z.string(),
  }),
});

export type ToolProvider = z.infer<typeof toolProviderSchema>;

// main
export const toolDtoSchema = z.object({
  toolId: z.string(),
  name: z.string(),
  provider: toolProviderSchema,
  ownerId: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type ToolDto = z.infer<typeof toolDtoSchema>;

// toolList
export const toolListRequestSchema = z.object({});

export const toolListResponseSchema = z.object({
  tools: z.array(toolDtoSchema),
});

export type ToolListRequest = z.infer<typeof toolListRequestSchema>;
export type ToolListResponse = z.infer<typeof toolListResponseSchema>;

export const toolListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: toolListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: toolListResponseSchema,
        },
      },
      description: "Retrieve the tool list",
    },
  },
});

// llmDetail
export const toolDetailRequestSchema = z.object({
  toolId: z.string(),
});

export const toolDetailResponseSchema = z.object({
  tool: toolDtoSchema.nullable(),
});

export type ToolDetailRequest = z.infer<typeof toolDetailRequestSchema>;
export type ToolDetailResponse = z.infer<typeof toolDetailResponseSchema>;

export const llmDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: toolDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: toolDetailResponseSchema,
        },
      },
      description: "Retrieve the tool detail",
    },
  },
});

// toolCreate
export const toolCreateRequestSchema = z.object({
  name: z.string(),
  provider: toolProviderSchema,
});

export const toolCreateResponseSchema = z.object({
  tool: toolDtoSchema,
});

export type ToolCreateRequest = z.infer<typeof toolCreateRequestSchema>;
export type ToolCreateResponse = z.infer<typeof toolCreateResponseSchema>;

export const toolCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: toolCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: toolCreateResponseSchema,
        },
      },
      description: "Create the tool",
    },
  },
});

// llmUpdate
export const toolUpdateRequestSchema = z.object({
  toolId: z.string(),
  name: z.string().optional(),
  provider: toolProviderSchema.optional(),
});

export const toolUpdateResponseSchema = z.object({});

export type ToolUpdateRequest = z.infer<typeof toolUpdateRequestSchema>;
export type ToolUpdateResponse = z.infer<typeof toolUpdateResponseSchema>;

export const toolUpdateRoute = createRoute({
  method: "post",
  path: "/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: toolUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: toolUpdateResponseSchema,
        },
      },
      description: "Update the tool",
    },
  },
});
