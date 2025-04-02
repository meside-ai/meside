import type { Context } from "hono";
import { UnauthorizedError } from "./error";

export type AuthUser = {
  userId: string;
  name: string;
  orgId: string;
};

export const getAuth = (c: Context): AuthUser | null => {
  const auth = c.get("auth");
  if (!auth) {
    return null;
  }
  const org = c.get("org");
  if (!org) {
    return null;
  }

  return {
    userId: auth.userId,
    orgId: org.orgId,
    name: auth.name,
  };
};

export const getAuthOrUnauthorized = (c: Context) => {
  const auth = getAuth(c);
  if (!auth) {
    throw new UnauthorizedError("Unauthorized");
  }
  return auth;
};

export const getAuthUserId = (c: Context) => {
  const auth = getAuth(c);
  if (!auth) {
    return null;
  }
  return auth.userId;
};
