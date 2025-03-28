import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// main
export const agentDtoSchema = z.object({
  agentId: z.string(),
  name: z.string(),
  backstory: z.string(),
  instruction: z.string(),
  goal: z.string(),
  llmId: z.string(),
  toolIds: z.array(z.string()),
  humanInput: z.boolean().optional(),
  ownerId: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type AgentDto = z.infer<typeof agentDtoSchema>;

// agentList
export const agentListRequestSchema = z.object({});

export const agentListResponseSchema = z.object({
  agents: z.array(agentDtoSchema),
});

export type AgentListRequest = z.infer<typeof agentListRequestSchema>;
export type AgentListResponse = z.infer<typeof agentListResponseSchema>;

export const agentListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: agentListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: agentListResponseSchema,
        },
      },
      description: "Retrieve the agent list",
    },
  },
});

// agentDetail
export const agentDetailRequestSchema = z.object({
  agentId: z.string(),
});

export const agentDetailResponseSchema = z.object({
  agent: agentDtoSchema.nullable(),
});

export type AgentDetailRequest = z.infer<typeof agentDetailRequestSchema>;
export type AgentDetailResponse = z.infer<typeof agentDetailResponseSchema>;

export const agentDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: agentDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: agentDetailResponseSchema,
        },
      },
      description: "Retrieve the agent detail",
    },
  },
});

// toolCreate
export const agentCreateRequestSchema = z.object({
  name: z.string(),
  backstory: z.string(),
  instruction: z.string(),
  goal: z.string(),
  llmId: z.string(),
  toolIds: z.array(z.string()),
  humanInput: z.boolean().optional(),
});

export const agentCreateResponseSchema = z.object({
  agent: agentDtoSchema,
});

export type AgentCreateRequest = z.infer<typeof agentCreateRequestSchema>;
export type AgentCreateResponse = z.infer<typeof agentCreateResponseSchema>;

export const agentCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: agentCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: agentCreateResponseSchema,
        },
      },
      description: "Create the agent",
    },
  },
});

// agentUpdate
export const agentUpdateRequestSchema = z.object({
  agentId: z.string(),
  name: z.string().optional(),
  backstory: z.string().optional(),
  instruction: z.string().optional(),
  goal: z.string().optional(),
  llmId: z.string().optional(),
  toolIds: z.array(z.string()).optional(),
  humanInput: z.boolean().optional(),
});

export const agentUpdateResponseSchema = z.object({});

export type AgentUpdateRequest = z.infer<typeof agentUpdateRequestSchema>;
export type AgentUpdateResponse = z.infer<typeof agentUpdateResponseSchema>;

export const agentUpdateRoute = createRoute({
  method: "post",
  path: "/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: agentUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: agentUpdateResponseSchema,
        },
      },
      description: "Update the agent",
    },
  },
});
