import { pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  foreignCuid,
  primaryKeyCuid,
  useCreatedAt,
  useUpdatedAt,
} from "../utils";

export const teamAgentTable = pgTable("team_agent", {
  teamAgentId: primaryKeyCuid("team_agent_id"),
  teamId: foreignCuid("team_id").notNull(),
  agentId: foreignCuid("agent_id").notNull(),
  createdAt: useCreatedAt(),
  updatedAt: useUpdatedAt(),
});

export const teamAgentEntitySchema = createSelectSchema(teamAgentTable);

export type TeamAgentEntity = z.infer<typeof teamAgentEntitySchema>;
