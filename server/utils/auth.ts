import type { Context } from "hono";
import { UnauthorizedError } from "./error";

export const getAuth = (
  c: Context,
): {
  userId: string;
  name: string;
  orgId: string;
} | null => {
  return {
    userId: "io56027z7qwd25mzq6upq947",
    orgId: "hkwgx29khaflgmm5c8ipp79r",
    name: "John Doe",
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
