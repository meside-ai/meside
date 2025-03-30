import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const teamTable = pgTable("team", {
  teamId: primaryKeyCuid("team_id"),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  ...useTimestamp(),
});

export const teamEntitySchema = createSelectSchema(teamTable);

export type TeamEntity = z.infer<typeof teamEntitySchema>;
