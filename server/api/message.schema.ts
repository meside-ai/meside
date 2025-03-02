import { messageEntitySchema } from "@/db/schema/message";
import { userEntitySchema } from "@/db/schema/user";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { threadDtoSchema } from "./thread.schema";

export const messageDtoSchema = messageEntitySchema.extend({
  owner: userEntitySchema
    .pick({
      userId: true,
      name: true,
      avatar: true,
    })
    .optional(),
  parentThread: threadDtoSchema,
  childThreads: z.array(threadDtoSchema),
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
