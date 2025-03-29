import "./instrumentation";
import { otel } from "@hono/otel";
import { Hono } from "hono";
import { chatApi } from "./api/chat";
import { llmApi } from "./api/llm";
import authRoutes from "./api/routes/auth.routes";
import { threadApi } from "./api/thread";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.use("*", otel());
app.onError(createErrorHandler());

app.route("/meside/server/thread", threadApi);
app.route("/meside/server/llm", llmApi);
app.route("/meside/server/chat", chatApi);
app.route("/meside/server/auth", authRoutes);

export default {
  ...app,
  port: 3003,
  idleTimeout: 30,
};
