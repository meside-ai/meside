import type { Context } from "hono";
import { HTTPError } from "./error";

export const createErrorHandler = () => {
  return async (error: Error, c: Context) => {
    try {
      if (error.stack) {
        console.error(error.stack);
      }
    } catch (e) {
      console.error("The error stack is not captured");
      console.error(e);
    }
    if (error instanceof HTTPError) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Internal Server Error" }, 500);
  };
};
