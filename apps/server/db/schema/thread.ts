import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const threadStatusEnum = pgEnum("status", ["idle", "active", "closed"]);

export const threadTable = pgTable("thread", {
  threadId: primaryKeyCuid("thread_id"),
  versionId: varchar("version_id", { length: 128 }).notNull(),
  activeVersion: boolean("active_version").notNull().default(false),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  shortName: text("short_name").notNull().default("question"),
  systemPrompt: text("system_prompt").notNull().default(""),
  userPrompt: text("user_prompt").notNull().default(""),
  messages: jsonb("messages").notNull().default([]),
  status: threadStatusEnum("status").notNull().default("idle"),
  parentThreadId: foreignCuid("parent_thread_id"),
  ...useTimestamp(),
});

export const threadEntitySchema = createSelectSchema(threadTable, {
  messages: z.any(),
});

export type ThreadEntity = z.infer<typeof threadEntitySchema>;
