import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { primaryKeyCuid, useCreatedAt } from "../utils";
import { foreignCuid } from "../utils";

export const sessionTable = pgTable("session", {
  sessionId: primaryKeyCuid("session_id"),
  userId: foreignCuid("user_id").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at", {
    precision: 3,
    mode: "string",
  }).notNull(),
  createdAt: useCreatedAt(),
});
