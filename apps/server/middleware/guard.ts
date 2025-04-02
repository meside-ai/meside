import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { BadRequestError, UnauthorizedError } from "../utils/error";

export const authGuardMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const auth = c.get("auth");

    if (!auth) {
      throw new UnauthorizedError();
    }

    await next();
  },
);

export const orgGuardMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const org = c.get("org");

    if (!org) {
      throw new BadRequestError("headers x-org-id is required");
    }

    await next();
  },
);
