import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { getUserById, verifyToken } from "../service/auth";

declare module "hono" {
  interface ContextVariableMap {
    auth: {
      userId: string;
      name: string;
    };
  }
}

export const authMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      await next();
      return;
    }

    let payload: { userId: string };

    try {
      payload = await verifyToken(token);
    } catch (error) {
      console.error(error);
      await next();
      return;
    }

    try {
      const userId = payload.userId;
      const user = await getUserById(userId);

      c.set("auth", {
        userId: user.userId,
        name: user.name ?? "",
      });

      await next();
    } catch (error) {
      await next();
      return;
    }
  },
);
