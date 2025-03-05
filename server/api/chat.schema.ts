import {
  systemMessageStructureSchema,
  userMessageStructureSchema,
} from "@/agents/types/message-structure";
import { messageEntitySchema } from "@/db/schema/message";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// chatSystem
export const chatSystemRequestSchema = z.object({
  parentThreadId: z.string(),
  structure: systemMessageStructureSchema,
});

export const chatSystemResponseSchema = z.object({
  message: messageEntitySchema,
});

export type ChatSystemRequest = z.infer<typeof chatSystemRequestSchema>;
export type ChatSystemResponse = z.infer<typeof chatSystemResponseSchema>;

export const chatSystemRoute = createRoute({
  method: "post",
  path: "/system",
  request: {
    body: {
      content: {
        "application/json": {
          schema: chatSystemRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: chatSystemResponseSchema,
        },
      },
      description: "Send a system message",
    },
  },
});

// chatUser
export const chatUserRequestSchema = z.object({
  parentThreadId: z.string(),
  structure: userMessageStructureSchema,
});

export const chatUserResponseSchema = z.object({
  message: messageEntitySchema,
});

export type ChatUserRequest = z.infer<typeof chatUserRequestSchema>;
export type ChatUserResponse = z.infer<typeof chatUserResponseSchema>;

export const chatUserRoute = createRoute({
  method: "post",
  path: "/user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: chatUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: chatUserResponseSchema,
        },
      },
      description: "Send a user message",
    },
  },
});

// chatAssistant
export const chatAssistantRequestSchema = z.object({
  parentThreadId: z.string(),
});

export const chatAssistantResponseSchema = z.object({
  message: messageEntitySchema,
});

export type ChatAssistantRequest = z.infer<typeof chatAssistantRequestSchema>;
export type ChatAssistantResponse = z.infer<typeof chatAssistantResponseSchema>;

export const chatAssistantRoute = createRoute({
  method: "post",
  path: "/assistant",
  request: {
    body: {
      content: {
        "application/json": {
          schema: chatAssistantRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: chatAssistantResponseSchema,
        },
      },
      description: "Send a assistant message",
    },
  },
});

// nameAssistant
export const nameAssistantRequestSchema = z.object({
  parentThreadId: z.string(),
});

export const nameAssistantResponseSchema = z.object({
  message: messageEntitySchema,
});

export type NameAssistantRequest = z.infer<typeof nameAssistantRequestSchema>;
export type NameAssistantResponse = z.infer<typeof nameAssistantResponseSchema>;

export const nameAssistantRoute = createRoute({
  method: "post",
  path: "/name",
  request: {
    body: {
      content: {
        "application/json": {
          schema: nameAssistantRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: nameAssistantResponseSchema,
        },
      },
      description: "Send a name assistant message",
    },
  },
});

// chatAssistantStream
export const chatAssistantStreamRequestSchema = z.object({
  parentThreadId: z.string(),
});

export const chatAssistantStreamResponseSchema = messageEntitySchema;

export type ChatAssistantStreamRequest = z.infer<
  typeof chatAssistantStreamRequestSchema
>;
export type ChatAssistantStreamResponse = z.infer<
  typeof chatAssistantStreamResponseSchema
>;

export const chatAssistantStreamRoute = createRoute({
  method: "get",
  path: "/assistant-stream",
  request: {
    query: chatAssistantStreamRequestSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: chatAssistantStreamResponseSchema,
        },
      },
      description: "Send a assistant message",
    },
  },
});
