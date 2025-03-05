import { messageEntitySchema } from "@/db/schema/message";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const messageDtoSchema = messageEntitySchema.pick({
  messageId: true,
  threadId: true,
  ownerId: true,
  orgId: true,
  messageRole: true,
  reason: true,
  text: true,
  structure: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type MessageDto = z.infer<typeof messageDtoSchema>;

// messageList
export const messageListRequestSchema = z.object({
  parentThreadId: z.string(),
  createdAtSort: z.enum(["asc", "desc"]).default("asc"),
});

export const messageListResponseSchema = z.object({
  messages: z.array(messageDtoSchema),
});

export type MessageListRequest = z.infer<typeof messageListRequestSchema>;
export type MessageListResponse = z.infer<typeof messageListResponseSchema>;

export const messageListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: messageListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: messageListResponseSchema,
        },
      },
      description: "Retrieve the message list",
    },
  },
});

// messageDetail
export const messageDetailRequestSchema = z.object({
  messageId: z.string(),
});

export const messageDetailResponseSchema = z.object({
  message: messageDtoSchema.nullable(),
});

export type MessageDetailRequest = z.infer<typeof messageDetailRequestSchema>;
export type MessageDetailResponse = z.infer<typeof messageDetailResponseSchema>;

export const messageDetailRoute = createRoute({
  method: "post",
  path: "/detail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: messageDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: messageDetailResponseSchema,
        },
      },
      description: "Retrieve the message detail",
    },
  },
});
