import { Hono } from "hono";
import { internalApi } from "./internal";

export const warehouseApi = new Hono();

warehouseApi.route("/internal", internalApi);
