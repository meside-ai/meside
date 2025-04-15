import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const managerAgentSchema = z.object({
  llmId: z.string().optional(),
  instructions: z.string().optional(),
});

export type ManagerAgent = z.infer<typeof managerAgentSchema>;

export const teamAgentSchema = z.object({
  llmId: z.string(),
  toolIds: z.array(z.string()),
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
});

export type TeamAgent = z.infer<typeof teamAgentSchema>;

export const teamOrchestrationSchema = z.object({
  type: z.literal("loop"),
  agents: z.array(teamAgentSchema).min(1),
});

export type TeamOrchestration = z.infer<typeof teamOrchestrationSchema>;

// main
export const teamDtoSchema = z.object({
  teamId: z.string(),
  name: z.string(),
  description: z.string(),
  orchestration: teamOrchestrationSchema,
  ownerId: z.string(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type TeamDto = z.infer<typeof teamDtoSchema>;

// teamList
export const teamListRequestSchema = z.object({});

export const teamListResponseSchema = z.object({
  teams: z.array(teamDtoSchema),
});

export type TeamListRequest = z.infer<typeof teamListRequestSchema>;
export type TeamListResponse = z.infer<typeof teamListResponseSchema>;

export const teamListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamListResponseSchema,
        },
      },
      description: "Retrieve the team list",
    },
  },
});

// teamDetail
export const teamDetailRequestSchema = z.object({
  teamId: z.string(),
});

export const teamDetailResponseSchema = z.object({
  team: teamDtoSchema.nullable(),
});

export type TeamDetailRequest = z.infer<typeof teamDetailRequestSchema>;
export type TeamDetailResponse = z.infer<typeof teamDetailResponseSchema>;

export const teamDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamDetailResponseSchema,
        },
      },
      description: "Retrieve the team detail",
    },
  },
});

// teamCreate
export const teamCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  orchestration: teamOrchestrationSchema,
});

export const teamCreateResponseSchema = z.object({
  team: teamDtoSchema,
});

export type TeamCreateRequest = z.infer<typeof teamCreateRequestSchema>;
export type TeamCreateResponse = z.infer<typeof teamCreateResponseSchema>;

export const teamCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamCreateResponseSchema,
        },
      },
      description: "Create the team",
    },
  },
});

// teamUpdate
export const teamUpdateRequestSchema = z.object({
  teamId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  orchestration: teamOrchestrationSchema.optional(),
});

export const teamUpdateResponseSchema = z.object({});

export type TeamUpdateRequest = z.infer<typeof teamUpdateRequestSchema>;
export type TeamUpdateResponse = z.infer<typeof teamUpdateResponseSchema>;

export const teamUpdateRoute = createRoute({
  method: "post",
  path: "/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamUpdateResponseSchema,
        },
      },
      description: "Update the team",
    },
  },
});
