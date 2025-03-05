import { getAgent } from "@/agents/agents";
import { getDrizzle } from "@/db/db";
import { type MessageEntity, messageTable } from "@/db/schema/message";
import { threadTable } from "@/db/schema/thread";
import { usageTable } from "@/db/schema/usage";
import { getAuth } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/error";
import { getSystemMessage } from "@/utils/message";
import { firstOrNotCreated, firstOrNotFound } from "@/utils/toolkit";
import { OpenAPIHono } from "@hono/zod-openapi";
import { MessageRole } from "@prisma/client";
import { and, asc, eq, isNull } from "drizzle-orm";
import {
  chatAssistantRoute,
  chatSystemRoute,
  chatUserRoute,
  nameAssistantRoute,
} from "./chat.schema";

export const chatApi = new OpenAPIHono()
  .openapi(chatSystemRoute, async (c) => {
    const body = c.req.valid("json");

    const auth = getAuth(c);

    if (!auth) {
      throw new UnauthorizedError();
    }

    const parentThread = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(eq(threadTable.threadId, body.parentThreadId)),
      "Failed to get parent thread",
    );

    const systemMessage = firstOrNotCreated(
      await getDrizzle()
        .insert(messageTable)
        .values({
          messageId: cuid(),
          threadId: parentThread.threadId,
          messageRole: MessageRole.SYSTEM,
          ownerId: auth.userId,
          orgId: auth.orgId,
          structure: body.structure,
        })
        .returning(),
      "No system message created",
    );

    return c.json({
      message: systemMessage,
    });
  })
  .openapi(chatUserRoute, async (c) => {
    const body = c.req.valid("json");

    const auth = getAuth(c);

    if (!auth) {
      throw new UnauthorizedError();
    }

    const parentThread = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(eq(threadTable.threadId, body.parentThreadId)),
      "Failed to get parent thread",
    );

    const message = firstOrNotCreated(
      await getDrizzle()
        .insert(messageTable)
        .values({
          messageId: cuid(),
          threadId: parentThread.threadId,
          messageRole: MessageRole.USER,
          ownerId: auth.userId,
          orgId: auth.orgId,
          structure: body.structure,
        })
        .returning(),
      "No user message created",
    );

    return c.json({
      message,
    });
  })
  .openapi(chatAssistantRoute, async (c) => {
    const body = c.req.valid("json");

    const authUser = getAuth(c);

    if (!authUser) {
      throw new UnauthorizedError();
    }

    const parentThread = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(eq(threadTable.threadId, body.parentThreadId)),
      "Failed to get parent thread",
    );

    const messages = await getDrizzle()
      .select()
      .from(messageTable)
      .where(
        and(
          eq(messageTable.threadId, parentThread.threadId),
          isNull(messageTable.deletedAt),
        ),
      )
      .orderBy(asc(messageTable.createdAt));

    if (messages.length === 0) {
      throw new NotFoundError("No messages found");
    }

    const systemMessage = getSystemMessage(messages);

    if (!systemMessage) {
      throw new BadRequestError("No system message found");
    }

    const { structure, llmRaw } = await getAgent(systemMessage)({
      messages,
    });

    const message = firstOrNotCreated(
      await getDrizzle().transaction(async (tx) => {
        const messages = await tx
          .insert(messageTable)
          .values({
            messageId: cuid(),
            threadId: parentThread.threadId,
            messageRole: MessageRole.ASSISTANT,
            ownerId: authUser.userId,
            orgId: authUser.orgId,
            structure,
          })
          .returning();
        await tx
          .update(threadTable)
          .set({
            hasQuestions: true,
          })
          .where(eq(threadTable.threadId, parentThread.threadId));
        await tx.insert(usageTable).values({
          usageId: cuid(),
          messageId: messages[0].messageId,
          ownerId: authUser.userId,
          orgId: authUser.orgId,
          modelName: llmRaw.model,
          inputToken: llmRaw.input,
          outputToken: llmRaw.output,
          finishReason: llmRaw.finishReason,
          structureType: structure.type,
        });
        return messages;
      }),
      "Failed to create assistant message",
    );

    return c.json({
      message,
    });
  })
  .openapi(nameAssistantRoute, async (c) => {
    const body = c.req.valid("json");

    const authUser = getAuth(c);

    if (!authUser) {
      throw new UnauthorizedError();
    }

    const parentThread = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(threadTable)
        .where(eq(threadTable.threadId, body.parentThreadId)),
      "Failed to get parent thread",
    );

    const messages = await getDrizzle()
      .select()
      .from(messageTable)
      .where(
        and(
          eq(messageTable.threadId, parentThread.threadId),
          isNull(messageTable.deletedAt),
        ),
      )
      .orderBy(asc(messageTable.createdAt));

    if (messages.length === 0) {
      throw new NotFoundError("No messages found");
    }

    const systemMessage: MessageEntity = {
      messageId: cuid(),
      threadId: parentThread.threadId,
      messageRole: MessageRole.SYSTEM,
      ownerId: authUser.userId,
      orgId: authUser.orgId,
      reason: "",
      text: "",
      structure: {
        type: "systemName",
        threadId: parentThread.threadId,
        minLength: 3,
        maxLength: 20,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    const composedMessages = [
      systemMessage,
      ...messages.filter(
        (message) => message.messageRole !== MessageRole.SYSTEM,
      ),
    ];

    const { structure, llmRaw } = await getAgent(systemMessage)({
      messages: composedMessages,
    });

    const message: MessageEntity = {
      ...systemMessage,
      structure,
    };

    if (structure.type !== "assistantName") {
      throw new BadRequestError("Assistant name is not supported");
    }

    await getDrizzle()
      .update(threadTable)
      .set({
        name: structure.name,
      })
      .where(eq(threadTable.threadId, parentThread.threadId));

    await getDrizzle().insert(usageTable).values({
      usageId: cuid(),
      messageId: null,
      ownerId: authUser.userId,
      orgId: authUser.orgId,
      modelName: llmRaw.model,
      inputToken: llmRaw.input,
      outputToken: llmRaw.output,
      finishReason: llmRaw.finishReason,
      structureType: structure.type,
    });

    return c.json({
      message,
    });
  });

export type ChatApiType = typeof chatApi;
