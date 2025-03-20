import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const labelDtoSchema = z.object({
  labelId: z.string(),
  warehouseId: z.string(),
  catalogFullName: z.string(),
  jsonLabel: z.string().nullable(),
  orgId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type LabelDto = z.infer<typeof labelDtoSchema>;

// catalogLoad
export const labelLoadRequestSchema = z.object({
  warehouseId: z.string(),
});

export const labelLoadResponseSchema = z.object({});

export type LabelLoadRequest = z.infer<typeof labelLoadRequestSchema>;
export type LabelLoadResponse = z.infer<typeof labelLoadResponseSchema>;

export const labelLoadRoute = createRoute({
  method: "post",
  path: "/load",
  request: {
    body: {
      content: {
        "application/json": {
          schema: labelLoadRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: labelLoadResponseSchema,
        },
      },
      description: "Load labels",
    },
  },
});
