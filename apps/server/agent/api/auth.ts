import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type GoogleLoginResponse,
  type LoginResponse,
  type MeResponse,
  type RefreshTokenResponse,
  type RegisterResponse,
  googleLoginRoute,
  loginRoute,
  meRoute,
  refreshTokenRoute,
  registerRoute,
} from "@meside/shared/api/auth.schema";
import { getAuthOrUnauthorized } from "../../utils/auth";
import { getUserDtos } from "../mapper/user";
import {
  getUserById,
  loginWithCredentials,
  loginWithGoogle,
  refreshToken,
  registerUser,
} from "../service/auth";

export const authApi = new OpenAPIHono();

authApi.openapi(registerRoute, async (c) => {
  const { email, username, password } = c.req.valid("json");

  const user = await registerUser(email, username, password);
  const userDto = await getUserDtos([user]);
  return c.json({ user: userDto[0] } as RegisterResponse);
});

authApi.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid("json");

  const result = await loginWithCredentials(email, password);
  const userDto = await getUserDtos([result.user]);

  return c.json({
    token: result.token,
    refreshToken: result.refreshToken,
    user: userDto[0],
  } as LoginResponse);
});

authApi.openapi(googleLoginRoute, async (c) => {
  const { idToken } = c.req.valid("json");

  const result = await loginWithGoogle(idToken);
  const userDto = await getUserDtos([result.user]);

  return c.json({
    token: result.token,
    refreshToken: result.refreshToken,
    user: userDto[0],
  } as GoogleLoginResponse);
});

authApi.openapi(refreshTokenRoute, async (c) => {
  const { refreshToken: refreshTokenString } = c.req.valid("json");

  const result = await refreshToken(refreshTokenString);
  return c.json({
    token: result.token,
    refreshToken: result.refreshToken,
  } as RefreshTokenResponse);
});

authApi.openapi(meRoute, async (c) => {
  const { userId } = getAuthOrUnauthorized(c);
  const user = await getUserById(userId);
  const userDto = await getUserDtos([user]);
  return c.json({ user: userDto[0] } as MeResponse);
});
