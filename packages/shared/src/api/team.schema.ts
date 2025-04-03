import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// main
export const teamDtoSchema = z.object({
  teamId: z.string(),
  name: z.string(),
  description: z.string(),
  agentIds: z.array(z.string()),
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

// teamAgentAssign
export const teamAgentAssignRequestSchema = z.object({
  teamId: z.string(),
  agentIds: z.array(z.string()),
});

export const teamAgentAssignResponseSchema = z.object({});

export type TeamAgentAssignRequest = z.infer<
  typeof teamAgentAssignRequestSchema
>;
export type TeamAgentAssignResponse = z.infer<
  typeof teamAgentAssignResponseSchema
>;

export const teamAgentAssignRoute = createRoute({
  method: "post",
  path: "/agent/assign",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamAgentAssignRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamAgentAssignResponseSchema,
        },
      },
      description: "Assign agents to team",
    },
  },
});

// teamAgentUnassign
export const teamAgentUnassignRequestSchema = z.object({
  teamId: z.string(),
  agentIds: z.array(z.string()),
});

export const teamAgentUnassignResponseSchema = z.object({});

export type TeamAgentUnassignRequest = z.infer<
  typeof teamAgentUnassignRequestSchema
>;
export type TeamAgentUnassignResponse = z.infer<
  typeof teamAgentUnassignResponseSchema
>;

export const teamAgentUnassignRoute = createRoute({
  method: "post",
  path: "/agent/unassign",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamAgentUnassignRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamAgentUnassignResponseSchema,
        },
      },
      description: "Unassign agents from team",
    },
  },
});

// teamAgentList
export const teamAgentListRequestSchema = z.object({
  teamId: z.string(),
});

export const teamAgentListResponseSchema = z.object({
  agents: z.array(
    z.object({
      agentId: z.string(),
      name: z.string(),
      description: z.string(),
    }),
  ),
});

export type TeamAgentListRequest = z.infer<typeof teamAgentListRequestSchema>;
export type TeamAgentListResponse = z.infer<typeof teamAgentListResponseSchema>;

export const teamAgentListRoute = createRoute({
  method: "post",
  path: "/agent/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: teamAgentListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: teamAgentListResponseSchema,
        },
      },
      description: "List all agents in a team",
    },
  },
});
