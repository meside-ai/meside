import { relations } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";
import { messageTable } from "./message";

export const threadTable = pgTable("thread", {
  threadId: primaryKeyCuid("thread_id"),
  parentMessageId: foreignCuid("parent_message_id"),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
  hasQuestions: boolean("has_questions").notNull().default(false),
  ...useTimestamp(),
});

export const threadRelations = relations(threadTable, ({ one, many }) => ({
  parentMessage: one(messageTable, {
    fields: [threadTable.parentMessageId],
    references: [messageTable.messageId],
  }),
  childMessages: many(messageTable),
}));

export const threadEntitySchema = createSelectSchema(threadTable);

export type ThreadEntity = z.infer<typeof threadEntitySchema>;
