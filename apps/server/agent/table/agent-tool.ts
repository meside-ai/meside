import { pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  foreignCuid,
  primaryKeyCuid,
  useCreatedAt,
  useUpdatedAt,
} from "../../db/utils";

export const agentToolTable = pgTable("agent_tool", {
  agentToolId: primaryKeyCuid("agent_tool_id"),
  agentId: foreignCuid("agent_id").notNull(),
  toolId: foreignCuid("tool_id").notNull(),
  createdAt: useCreatedAt(),
  updatedAt: useUpdatedAt(),
});

export const agentToolEntitySchema = createSelectSchema(agentToolTable);

export type AgentToolEntity = z.infer<typeof agentToolEntitySchema>;
