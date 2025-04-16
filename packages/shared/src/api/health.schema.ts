import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// main
export const healthDtoSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
});

export type HealthDto = z.infer<typeof healthDtoSchema>;

// health
export const healthRequestSchema = z.object({});

export const healthResponseSchema = z.object({
  health: healthDtoSchema,
});

export type HealthRequest = z.infer<typeof healthRequestSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const healthRoute = createRoute({
  method: "post",
  path: "/health",
  request: {
    body: {
      content: {
        "application/json": {
          schema: healthRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
      description: "Retrieve the health",
    },
  },
});
