import type { Context } from "hono";
import { HTTPError } from "./error";

export const createErrorHandler = () => {
  return async (error: Error, c: Context) => {
    console.error(error);
    if (error instanceof HTTPError) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Unknown Internal Server Error" }, 500);
  };
};
