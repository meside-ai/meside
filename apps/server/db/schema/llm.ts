import {
  type LlmProvider,
  llmProviderSchema,
} from "@meside/shared/api/llm.schema";
import { boolean, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const llmTable = pgTable("llm", {
  llmId: primaryKeyCuid("llm_id"),
  name: text("name").notNull().unique(),
  provider: jsonb("provider").notNull().$type<LlmProvider>(),
  isDefault: boolean("is_default").notNull().default(false),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  ...useTimestamp(),
});

export const llmEntitySchema = createSelectSchema(llmTable, {
  provider: llmProviderSchema,
});

export type LlmEntity = z.infer<typeof llmEntitySchema>;
