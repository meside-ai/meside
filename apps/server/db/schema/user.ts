import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { primaryKeyCuid, useTimestamp } from "../utils";

export const userTable = pgTable("user", {
  userId: primaryKeyCuid("user_id"),
  name: text("name").notNull(),
  password: text("password"),
  email: text("email"),
  avatar: text("avatar"),
  ...useTimestamp(),
});

export const userEntitySchema = createSelectSchema(userTable);

export type UserEntity = z.infer<typeof userEntitySchema>;
