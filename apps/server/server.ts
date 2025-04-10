import "./instrumentation";
import { otel } from "@hono/otel";
import { Hono } from "hono";
import { agentApi } from "./agent/api";
import { environment } from "./configs/environment";
import { authMiddleware } from "./middleware/auth";
import { createDbMiddleware } from "./middleware/db";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.use("*", otel());
app.use("*", createDbMiddleware());
app.use("*", authMiddleware);
app.onError(createErrorHandler());

app.route("/meside/server", agentApi);

export default {
  ...app,
  port: environment.PORT,
  idleTimeout: environment.IDLE_TIMEOUT,
};
