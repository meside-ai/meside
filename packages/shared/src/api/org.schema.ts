import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// main
export const orgDtoSchema = z.object({
  orgId: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type OrgDto = z.infer<typeof orgDtoSchema>;

// orgList
export const orgListRequestSchema = z.object({});

export const orgListResponseSchema = z.object({
  orgs: z.array(orgDtoSchema),
});

export type OrgListRequest = z.infer<typeof orgListRequestSchema>;
export type OrgListResponse = z.infer<typeof orgListResponseSchema>;

export const orgListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: orgListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: orgListResponseSchema,
        },
      },
      description: "Retrieve the organization list",
    },
  },
});

// orgDetail
export const orgDetailRequestSchema = z.object({
  orgId: z.string(),
});

export const orgDetailResponseSchema = z.object({
  org: orgDtoSchema.nullable(),
});

export type OrgDetailRequest = z.infer<typeof orgDetailRequestSchema>;
export type OrgDetailResponse = z.infer<typeof orgDetailResponseSchema>;

export const orgDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: orgDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: orgDetailResponseSchema,
        },
      },
      description: "Retrieve the organization detail",
    },
  },
});

// orgCreate
export const orgCreateRequestSchema = z.object({
  name: z.string(),
});

export const orgCreateResponseSchema = z.object({
  org: orgDtoSchema,
});

export type OrgCreateRequest = z.infer<typeof orgCreateRequestSchema>;
export type OrgCreateResponse = z.infer<typeof orgCreateResponseSchema>;

export const orgCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: orgCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: orgCreateResponseSchema,
        },
      },
      description: "Create the organization",
    },
  },
});

// orgUpdate
export const orgUpdateRequestSchema = z.object({
  orgId: z.string(),
  name: z.string().optional(),
});

export const orgUpdateResponseSchema = z.object({});

export type OrgUpdateRequest = z.infer<typeof orgUpdateRequestSchema>;
export type OrgUpdateResponse = z.infer<typeof orgUpdateResponseSchema>;

export const orgUpdateRoute = createRoute({
  method: "post",
  path: "/update",
  request: {
    body: {
      content: {
        "application/json": {
          schema: orgUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: orgUpdateResponseSchema,
        },
      },
      description: "Update the organization",
    },
  },
});
