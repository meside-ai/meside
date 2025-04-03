import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { userDtoSchema } from "./user.schema";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

export const registerResponseSchema = z.object({
  user: userDtoSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: registerResponseSchema,
        },
      },
      description: "User created successfully",
    },
  },
});

// Login
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  user: userDtoSchema,
  token: z.string(),
  refreshToken: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: loginResponseSchema,
        },
      },
      description: "Login successful",
    },
  },
});

// Google Login
export const googleLoginRequestSchema = z.object({
  idToken: z.string(),
});

export const googleLoginResponseSchema = loginResponseSchema;

export type GoogleLoginRequest = z.infer<typeof googleLoginRequestSchema>;
export type GoogleLoginResponse = z.infer<typeof googleLoginResponseSchema>;

export const googleLoginRoute = createRoute({
  method: "post",
  path: "/google",
  request: {
    body: {
      content: {
        "application/json": {
          schema: googleLoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: googleLoginResponseSchema,
        },
      },
      description: "Google login successful",
    },
  },
});

// Refresh Token
export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export const refreshTokenRoute = createRoute({
  method: "post",
  path: "/refresh",
  request: {
    body: {
      content: {
        "application/json": {
          schema: refreshTokenRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: refreshTokenResponseSchema,
        },
      },
      description: "Token refreshed successfully",
    },
  },
});

// Get Current User
export const meRequestSchema = z.object({});

export const meResponseSchema = z.object({
  user: userDtoSchema,
});

export type MeRequest = z.infer<typeof meRequestSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;

export const meRoute = createRoute({
  method: "post",
  path: "/me",
  request: {
    body: {
      content: {
        "application/json": {
          schema: meRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: meResponseSchema,
        },
      },
      description: "User information",
    },
  },
});
