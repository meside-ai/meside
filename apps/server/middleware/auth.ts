import { getLogger } from "@meside/shared/logger/index";
import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { getUserById, verifyToken } from "../service/auth";

declare module "hono" {
  interface ContextVariableMap {
    auth:
      | {
          userId: string;
          name: string;
        }
      | undefined;
    org:
      | {
          orgId: string;
        }
      | undefined;
  }
}

const logger = getLogger("authMiddleware");

export const authMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    const orgId = c.req.header("X-Org-Id");

    // set token and orgId to context
    if (token) {
      try {
        const payload = await verifyToken(token);
        const user = await getUserById(payload.userId);
        c.set("auth", {
          userId: user.userId,
          name: user.name ?? "",
        });
      } catch (error) {
        logger.error(error);
      }
    }

    if (orgId) {
      c.set("org", {
        orgId,
      });
    }

    await next();
  },
);
