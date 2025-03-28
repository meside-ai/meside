import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const agentTable = pgTable("agent", {
  agentId: primaryKeyCuid("agent_id"),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  llmId: foreignCuid("llm_id").notNull(),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  ...useTimestamp(),
});

export const agentEntitySchema = createSelectSchema(agentTable);

export type AgentEntity = z.infer<typeof agentEntitySchema>;
