import {
  type TeamOrchestration,
  teamOrchestrationSchema,
} from "@meside/shared/api/team.schema";
import { jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../../db/utils";

export const teamTable = pgTable(
  "team",
  {
    teamId: primaryKeyCuid("team_id"),
    name: text("name").notNull(),
    description: text("description").notNull(),
    orchestration: jsonb("orchestration").notNull().$type<TeamOrchestration>(),
    ownerId: foreignCuid("owner_id").notNull(),
    orgId: foreignCuid("org_id").notNull(),
    ...useTimestamp(),
  },
  (table) => [uniqueIndex("team_unique").on(table.name, table.orgId)],
);

export const teamEntitySchema = createSelectSchema(teamTable, {
  orchestration: teamOrchestrationSchema,
});

export type TeamEntity = z.infer<typeof teamEntitySchema>;
