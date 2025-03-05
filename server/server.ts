import { environment } from "@/configs/environment";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { catalogApi } from "./api/catalog";
import { chatApi } from "./api/chat";
import { healthApi } from "./api/health";
import { messageApi } from "./api/message";
import { threadApi } from "./api/thread";
import { warehouseApi } from "./api/warehouse";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.route("/aidw/api/health", healthApi);
app.route("/aidw/api/warehouse", warehouseApi);
app.route("/aidw/api/catalog", catalogApi);
app.route("/aidw/api/chat", chatApi);
app.route("/aidw/api/message", messageApi);
app.route("/aidw/api/thread", threadApi);

app.get("/assets/*", serveStatic({ root: "./dist" }));
app.get("/*", serveStatic({ path: "./dist/index.html" }));

app.onError(createErrorHandler());

export default {
  ...app,
  port: environment.PORT,
};
