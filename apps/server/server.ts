import "./instrumentation";
import { otel } from "@hono/otel";
import { Hono } from "hono";
import { authApi } from "./api/auth";
import { chatApi } from "./api/chat";
import { llmApi } from "./api/llm";
import { orgApi } from "./api/org";
import { teamApi } from "./api/team";
import { threadApi } from "./api/thread";
import { toolApi } from "./api/tool";
import { environment } from "./configs/environment";
import { authMiddleware } from "./middleware/auth";
import { createDbMiddleware } from "./middleware/db";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.use("*", otel());
app.use("*", createDbMiddleware());
app.use("*", authMiddleware);
app.onError(createErrorHandler());

app.route("/meside/server/auth", authApi);
app.route("/meside/server/org", orgApi);
app.route("/meside/server/thread", threadApi);
app.route("/meside/server/llm", llmApi);
app.route("/meside/server/chat", chatApi);
app.route("/meside/server/team", teamApi);
app.route("/meside/server/tool", toolApi);

export default {
  ...app,
  port: environment.PORT,
  idleTimeout: environment.IDLE_TIMEOUT,
};
