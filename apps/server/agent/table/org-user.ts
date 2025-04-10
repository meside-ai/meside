import { pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  foreignCuid,
  primaryKeyCuid,
  useCreatedAt,
  useUpdatedAt,
} from "../../db/utils";

export const orgUserTable = pgTable("org_user", {
  orgUserId: primaryKeyCuid("org_user_id"),
  orgId: foreignCuid("org_id").notNull(),
  userId: foreignCuid("user_id").notNull(),
  createdAt: useCreatedAt(),
  updatedAt: useUpdatedAt(),
});

export const orgUserEntitySchema = createSelectSchema(orgUserTable);

export type OrgUserEntity = z.infer<typeof orgUserEntitySchema>;
