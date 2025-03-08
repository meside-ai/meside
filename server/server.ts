import { environment } from "@/configs/environment";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { catalogApi } from "./api/catalog";
import { chatApi } from "./api/chat";
import { healthApi } from "./api/health";
import { messageApi } from "./api/message";
import { questionApi } from "./api/question";
import { streamApi } from "./api/stream";
import { threadApi } from "./api/thread";
import { warehouseApi } from "./api/warehouse";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.route("/meside/api/health", healthApi);
app.route("/meside/api/warehouse", warehouseApi);
app.route("/meside/api/catalog", catalogApi);
app.route("/meside/api/chat", chatApi);
app.route("/meside/api/message", messageApi);
app.route("/meside/api/thread", threadApi);
app.route("/meside/api/stream", streamApi);
app.route("/meside/api/question", questionApi);

app.get("/assets/*", serveStatic({ root: "./dist" }));
app.get("/*", serveStatic({ path: "./dist/index.html" }));

app.onError(createErrorHandler());

export default {
  ...app,
  port: environment.PORT,
  idleTimeout: environment.IDLE_TIMEOUT,
};
