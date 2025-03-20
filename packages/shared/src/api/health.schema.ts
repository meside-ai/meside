import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// healthHeartbeat
export const healthHeartbeatRequestSchema = z.object({});

export const healthHeartbeatResponseSchema = z.object({
  version: z.string(),
});

export type HealthHeartbeatRequest = z.infer<
  typeof healthHeartbeatRequestSchema
>;
export type HealthHeartbeatResponse = z.infer<
  typeof healthHeartbeatResponseSchema
>;

export const healthHeartbeatRoute = createRoute({
  method: "post",
  path: "/heartbeat",
  request: {
    body: {
      content: {
        "application/json": {
          schema: healthHeartbeatRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: healthHeartbeatResponseSchema,
        },
      },
      description: "Send a heartbeat",
    },
  },
});
