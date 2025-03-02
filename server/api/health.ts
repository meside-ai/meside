import { OpenAPIHono } from "@hono/zod-openapi";
import { healthHeartbeatRoute } from "./health.schema";

export const healthApi = new OpenAPIHono().openapi(
  healthHeartbeatRoute,
  async (c) => {
    return c.json({
      version: "0.0.1",
    });
  },
);

export type HealthApiType = typeof healthApi;
