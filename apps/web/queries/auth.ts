import {
  type GoogleLoginRequest,
  type GoogleLoginResponse,
  type LoginRequest,
  type LoginResponse,
  type MeRequest,
  type MeResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type RegisterRequest,
  type RegisterResponse,
  googleLoginRoute,
  loginRoute,
  meRoute,
  refreshTokenRoute,
  registerRoute,
} from "@meside/shared/api/auth.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";
import { createPost } from "../utils/request";

export const getLogin = (): UseMutationOptions<
  LoginResponse,
  QueryClientError,
  LoginRequest
> => ({
  mutationKey: [getLogin.name],
  mutationFn: async (body) => {
    const json = await createPost<LoginRequest, LoginResponse>(
      `/meside/server/auth${loginRoute.path}`,
    )(body);
    return json;
  },
});

export const getRegister = (): UseMutationOptions<
  RegisterResponse,
  QueryClientError,
  RegisterRequest
> => ({
  mutationKey: [getRegister.name],
  mutationFn: async (body) => {
    const json = await createPost<RegisterRequest, RegisterResponse>(
      `/meside/server/auth${registerRoute.path}`,
    )(body);
    return json;
  },
});

export const getGoogleLogin = (): UseMutationOptions<
  GoogleLoginResponse,
  QueryClientError,
  GoogleLoginRequest
> => ({
  mutationKey: [getGoogleLogin.name],
  mutationFn: async (body) => {
    const json = await createPost<GoogleLoginRequest, GoogleLoginResponse>(
      `/meside/server/auth${googleLoginRoute.path}`,
    )(body);
    return json;
  },
});

export const getRefreshToken = (): UseMutationOptions<
  RefreshTokenResponse,
  QueryClientError,
  RefreshTokenRequest
> => ({
  mutationKey: [getRefreshToken.name],
  mutationFn: async (body) => {
    const json = await createPost<RefreshTokenRequest, RefreshTokenResponse>(
      `/meside/server/auth${refreshTokenRoute.path}`,
    )(body);
    return json;
  },
});

export const getMe = ({ token }: MeRequest): UseQueryOptions<MeResponse> => ({
  enabled: !!token,
  queryKey: [getMe.name, token],
  queryFn: async () => {
    const json = await createPost<MeRequest, MeResponse>(
      `/meside/server/auth${meRoute.path}`,
    )({ token });
    return json;
  },
});
