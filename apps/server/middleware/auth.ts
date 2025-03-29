import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { getUserById, verifyToken } from "../service/auth";

declare module "hono" {
  interface ContextVariableMap {
    auth: {
      userId: string;
    };
  }
}

export const authMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return c.json({ message: "Authentication required" }, 401);
    }

    try {
      const payload = await verifyToken(token);
      const userId = payload.userId as string;

      const user = await getUserById(userId);

      if (!user) {
        return c.json({ message: "User not found" }, 401);
      }

      c.set("auth", {
        userId: user.userId,
      });

      await next();
    } catch (error) {
      return c.json({ message: "Invalid token" }, 403);
    }
  },
);
