import { type QuestionPayload, questionPayloadSchema } from "@/questions";
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
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const assistantStatusEnum = pgEnum("assistant_status", [
  "none",
  "pending",
  "success",
  "error",
]);

export const questionTable = pgTable("question", {
  questionId: primaryKeyCuid("question_id"),
  versionId: varchar("version_id", { length: 128 }).notNull(),
  activeVersion: boolean("active_version").notNull().default(false),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  shortName: text("short_name").notNull().default("question"),
  userContent: text("user_content").notNull().default(""),
  assistantReason: text("assistant_reason").notNull(),
  assistantContent: text("assistant_content").notNull(),
  assistantStatus: assistantStatusEnum("assistant_status")
    .notNull()
    .default("none"),
  payload: jsonb("payload").notNull().$type<QuestionPayload>(),
  parentQuestionId: foreignCuid("parent_question_id"),
  ...useTimestamp(),
});

export const questionRelations = relations(questionTable, ({ one, many }) => ({
  parentQuestion: one(questionTable, {
    fields: [questionTable.parentQuestionId],
    references: [questionTable.questionId],
  }),
  childQuestions: many(questionTable),
}));

export const questionEntitySchema = createSelectSchema(questionTable, {
  payload: questionPayloadSchema,
});

export type QuestionEntity = z.infer<typeof questionEntitySchema>;
