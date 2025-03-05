import { getAgent } from "@/agents/agents";
import type { AIStructureOutput } from "@/ai/ai-structure";
import { getDrizzle } from "@/db/db";
import { type MessageEntity, messageTable } from "@/db/schema/message";
import { threadTable } from "@/db/schema/thread";
import { usageTable } from "@/db/schema/usage";
import { getMessageDtos } from "@/mappers/message";
import { type AuthUser, getAuth } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/error";
import { getSystemMessage } from "@/utils/message";
import { firstOrNotCreated, firstOrNotFound } from "@/utils/toolkit";
import { streamSqlGeneration } from "@/workflows/sql-generation";
import { OpenAPIHono } from "@hono/zod-openapi";
import { MessageRole } from "@prisma/client";
import { and, asc, eq, isNull } from "drizzle-orm";
import { streamSSE } from "hono/streaming";
import {
  type ChatAssistantStreamResponse,
  chatAssistantRoute,
  chatAssistantStreamRoute,
  chatSystemRoute,
  chatUserRoute,
  nameAssistantRoute,
} from "./chat.schema";
import type { MessageDto } from "./message.schema";

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
  })
  .openapi(chatAssistantStreamRoute, async (c) => {
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

    const aiStream = await streamSqlGeneration({
      messages,
    });

    return streamSSE(c, async (stream) => {
      const reader = aiStream.getReader();
      const initial: AIStructureOutput = {
        reason: "",
        text: "",
        promptTokens: 0,
        completionTokens: 0,
        structure: null,
      };
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            const message = await persistMessage({
              threadId: parentThread.threadId,
              authUser,
              messageRole: MessageRole.ASSISTANT,
              structure: initial.structure,
              inputToken: initial.promptTokens,
              outputToken: initial.completionTokens,
            });
            await stream.writeSSE({
              data: JSON.stringify(getStreamData(initial, message)),
            });
            break;
          }
          const streamResponse = Object.assign(initial, value);
          await stream.writeSSE({
            data: JSON.stringify(getStreamData(streamResponse, null)),
          });
        }
      } finally {
        reader.releaseLock();
      }
    });
  });

export type ChatApiType = typeof chatApi;

const getStreamData = (
  output: AIStructureOutput,
  message: MessageDto | null,
): ChatAssistantStreamResponse => {
  return {
    message,
    stream: {
      reason: output.reason,
      text: output.text,
    },
  };
};

const persistMessage = async (props: {
  threadId: string;
  authUser: AuthUser;
  messageRole: MessageRole;
  structure: MessageEntity["structure"];
  inputToken: number;
  outputToken: number;
}): Promise<MessageDto> => {
  const {
    threadId,
    authUser,
    messageRole,
    structure,
    inputToken,
    outputToken,
  } = props;

  const message = firstOrNotCreated(
    await getDrizzle().transaction(async (tx) => {
      const messages = await tx
        .insert(messageTable)
        .values({
          messageId: cuid(),
          threadId,
          messageRole,
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
        .where(eq(threadTable.threadId, threadId));
      await tx.insert(usageTable).values({
        usageId: cuid(),
        messageId: messages[0].messageId,
        ownerId: authUser.userId,
        orgId: authUser.orgId,
        modelName: "unknown",
        inputToken,
        outputToken,
        finishReason: "unknown",
        structureType: structure.type,
      });
      return messages;
    }),
    "Failed to create assistant message",
  );

  const messageDtos = await getMessageDtos([message]);

  return messageDtos[0];
};
