import "./instrumentation";
import { otel } from "@hono/otel";
import { Hono } from "hono";
import { authApi } from "./api/auth";
import { chatApi } from "./api/chat";
import { llmApi } from "./api/llm";
import { threadApi } from "./api/thread";
import { authMiddleware } from "./middleware/auth";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.use("*", otel());
app.use("*", authMiddleware);
app.onError(createErrorHandler());

app.route("/meside/server/auth", authApi);
app.route("/meside/server/thread", threadApi);
app.route("/meside/server/llm", llmApi);
app.route("/meside/server/chat", chatApi);

export default {
  ...app,
  port: 3003,
  idleTimeout: 30,
};
