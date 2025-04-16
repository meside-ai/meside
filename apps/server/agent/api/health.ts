import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "@meside/shared/api/health.schema";

export const healthApi = new OpenAPIHono();

healthApi.openapi(healthRoute, async (c) => {
  return c.json({
    health: {
      version: "0.2.0",
      generatedAt: new Date().toISOString(),
    },
  });
});
