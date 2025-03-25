import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { userDtoSchema } from "./user.schema";

export const llmProviderSchema = z.union([
  z.object({
    provider: z.literal("openai"),
    apiKey: z.string(),
    model: z.enum(["gpt-4o"]),
  }),
  z.object({
    provider: z.literal("deepseek"),
    apiKey: z.string(),
    model: z.enum(["deepseek-chat"]),
  }),
  z.object({
    provider: z.literal("openaiCompatible"),
    apiKey: z.string(),
    baseUrl: z.string(),
    model: z.string(),
    isCompatibleTool: z.boolean(),
  }),
]);

export type LlmProvider = z.infer<typeof llmProviderSchema>;

// main
export const llmDtoSchema = z.object({
  llmId: z.string(),
  name: z.string(),
  provider: llmProviderSchema,
  isDefault: z.boolean().optional(),
  ownerId: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  owner: userDtoSchema.optional(),
});

export type LlmDto = z.infer<typeof llmDtoSchema>;

// llmList
export const llmListRequestSchema = z.object({});

export const llmListResponseSchema = z.object({
  llms: z.array(llmDtoSchema),
});

export type LlmListRequest = z.infer<typeof llmListRequestSchema>;
export type LlmListResponse = z.infer<typeof llmListResponseSchema>;

export const llmListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: llmListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: llmListResponseSchema,
        },
      },
      description: "Retrieve the llm list",
    },
  },
});

// llmDetail
export const llmDetailRequestSchema = z.object({
  llmId: z.string(),
});

export const llmDetailResponseSchema = z.object({
  llm: llmDtoSchema.nullable(),
});

export type LlmDetailRequest = z.infer<typeof llmDetailRequestSchema>;
export type LlmDetailResponse = z.infer<typeof llmDetailResponseSchema>;

export const llmDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: llmDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: llmDetailResponseSchema,
        },
      },
      description: "Retrieve the llm detail",
    },
  },
});

// llmCreate
export const llmCreateRequestSchema = z.object({
  name: z.string(),
  provider: llmProviderSchema,
  isDefault: z.boolean().optional(),
});

export const llmCreateResponseSchema = z.object({
  llm: llmDtoSchema,
});

export type LlmCreateRequest = z.infer<typeof llmCreateRequestSchema>;
export type LlmCreateResponse = z.infer<typeof llmCreateResponseSchema>;

export const llmCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: llmCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: llmCreateResponseSchema,
        },
      },
      description: "Create the llm",
    },
  },
});

// llmUpdate
export const llmUpdateRequestSchema = z.object({
  llmId: z.string(),
  name: z.string().optional(),
  provider: llmProviderSchema.optional(),
  isDefault: z.boolean().optional(),
});

export const llmUpdateResponseSchema = z.object({});

export type LlmUpdateRequest = z.infer<typeof llmUpdateRequestSchema>;
export type LlmUpdateResponse = z.infer<typeof llmUpdateResponseSchema>;

export const llmUpdateRoute = createRoute({
  method: "post",
  path: "/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: llmUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: llmUpdateResponseSchema,
        },
      },
      description: "Update the llm",
    },
  },
});
