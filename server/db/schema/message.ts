import {
  type MessageStructure,
  messageStructureSchema,
} from "@/agents/types/message-structure";
import { relations } from "drizzle-orm";
import { json, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";
import { threadTable } from "./thread";

export const messageRole = pgEnum("message_role", [
  "SYSTEM",
  "USER",
  "ASSISTANT",
]);

export const messageTable = pgTable("message", {
  messageId: primaryKeyCuid("message_id"),
  threadId: foreignCuid("thread_id").notNull(),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  messageRole: messageRole("message_role").notNull(),
  reason: text("reason").notNull().default(""),
  text: text("text").notNull().default(""),
  structure: json("structure").notNull().$type<MessageStructure>(),
  ...useTimestamp(),
});

export const messageRelations = relations(messageTable, ({ one, many }) => ({
  parentThread: one(threadTable, {
    fields: [messageTable.threadId],
    references: [threadTable.threadId],
  }),
  childThreads: many(threadTable),
}));

export const messageEntitySchema = createSelectSchema(messageTable, {
  structure: messageStructureSchema,
});

export type MessageEntity = z.infer<typeof messageEntitySchema>;
