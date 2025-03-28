import {
  type ToolProvider,
  toolProviderSchema,
} from "@meside/shared/api/tool.schema";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const toolTable = pgTable("tool", {
  toolId: primaryKeyCuid("tool_id"),
  name: text("name").notNull().unique(),
  provider: jsonb("provider").notNull().$type<ToolProvider>(),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  ...useTimestamp(),
});

export const toolEntitySchema = createSelectSchema(toolTable, {
  provider: toolProviderSchema,
});

export type ToolEntity = z.infer<typeof toolEntitySchema>;
