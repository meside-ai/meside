import { threadEntitySchema } from "@/db/schema/thread";
import { userEntitySchema } from "@/db/schema/user";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const threadDtoSchema = threadEntitySchema.extend({
  owner: userEntitySchema
    .pick({
      userId: true,
      name: true,
      avatar: true,
    })
    .optional(),
});

export type ThreadDto = z.infer<typeof threadDtoSchema>;

// threadList
export const threadListRequestSchema = z.object({
  threadId: z.string().optional(),
  parentMessageId: z.string().nullable().optional(),
  createdAtSort: z.enum(["asc", "desc"]).default("asc"),
});

export const threadListResponseSchema = z.object({
  threads: z.array(threadDtoSchema),
});

export type ThreadListRequest = z.infer<typeof threadListRequestSchema>;
export type ThreadListResponse = z.infer<typeof threadListResponseSchema>;

export const threadListRoute = createRoute({
  method: "post",
  path: "/list",
  request: {
    body: {
      content: {
        "application/json": {
          schema: threadListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: threadListResponseSchema,
        },
      },
      description: "Retrieve the thread list",
    },
  },
});

// threadCreate
export const threadCreateRequestSchema = z.object({
  parentMessageId: z.string().nullable(),
  name: z.string(),
});

export const threadCreateResponseSchema = z.object({
  thread: threadDtoSchema,
});

export type ThreadCreateRequest = z.infer<typeof threadCreateRequestSchema>;
export type ThreadCreateResponse = z.infer<typeof threadCreateResponseSchema>;

export const threadCreateRoute = createRoute({
  method: "post",
  path: "/create",
  request: {
    body: {
      content: {
        "application/json": {
          schema: threadCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: threadCreateResponseSchema,
        },
      },
      description: "Create the thread",
    },
  },
});
