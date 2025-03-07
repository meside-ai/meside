import type { QuestionPayload } from "@/questions";
import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const questionTable = pgTable("question", {
  questionId: primaryKeyCuid("question_id"),
  versionId: varchar("version_id", { length: 128 }).notNull(),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  shortName: text("short_name").notNull().default("question"),
  userContent: text("user_content").notNull().default(""),
  assistantReason: text("assistant_reason"),
  assistantContent: text("assistant_content"),
  payload: jsonb("payload").$type<QuestionPayload>(),
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

export const questionEntitySchema = createSelectSchema(questionTable);

export type QuestionEntity = z.infer<typeof questionEntitySchema>;
