import { Hono } from "hono";
import { internalApi } from "./internal";
import { warehouseApi as warehouseImplApi } from "./warehouse";

export const warehouseApi = new Hono();

warehouseApi.route("/internal", internalApi);
warehouseApi.route("/warehouse", warehouseImplApi);
