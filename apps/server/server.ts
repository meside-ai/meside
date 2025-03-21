import { Hono } from "hono";
import { threadApi } from "./api/thread";
import { createErrorHandler } from "./utils/error-handler";

const app = new Hono();

app.route("/meside/server", threadApi);

app.onError(createErrorHandler());

export default {
  ...app,
  port: 3003,
};
