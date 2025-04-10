import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../../db/utils";

export const agentTable = pgTable(
  "agent",
  {
    agentId: primaryKeyCuid("agent_id"),
    name: text("name").notNull(),
    description: text("description").notNull(),
    instructions: text("instructions").notNull(),
    llmId: foreignCuid("llm_id").notNull(),
    ownerId: foreignCuid("owner_id").notNull(),
    orgId: foreignCuid("org_id").notNull(),
    ...useTimestamp(),
  },
  (table) => [uniqueIndex("agent_unique").on(table.name, table.orgId)],
);

export const agentEntitySchema = createSelectSchema(agentTable);

export type AgentEntity = z.infer<typeof agentEntitySchema>;
