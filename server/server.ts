import { environment } from "@/configs/environment";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { catalogApi } from "./api/catalog";
import { healthApi } from "./api/health";
import { labelApi } from "./api/label";
import { mcpServerApi } from "./api/mcp-server";
import { questionApi } from "./api/question";
import { streamApi } from "./api/stream";
import { warehouseApi } from "./api/warehouse";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.route("/meside/api/health", healthApi);
app.route("/meside/api/warehouse", warehouseApi);
app.route("/meside/api/catalog", catalogApi);
app.route("/meside/api/label", labelApi);
app.route("/meside/api/stream", streamApi);
app.route("/meside/api/question", questionApi);
app.route("/meside/api/mcp-server", mcpServerApi);

app.get("/assets/*", serveStatic({ root: "./dist" }));
app.get("/*", serveStatic({ path: "./dist/index.html" }));

app.onError(createErrorHandler());

export default {
  ...app,
  port: environment.PORT,
  idleTimeout: environment.IDLE_TIMEOUT,
};
