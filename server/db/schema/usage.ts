import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const usageTable = pgTable("usage", {
  usageId: primaryKeyCuid("usage_id"),
  messageId: foreignCuid("message_id"),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  modelName: text("model_name").notNull(),
  inputToken: integer("input_token").notNull(),
  outputToken: integer("output_token").notNull(),
  finishReason: text("finish_reason").notNull(),
  structureType: text("structure_type"),
  ...useTimestamp(),
});

export const usageEntitySchema = createSelectSchema(usageTable);

export type UsageEntity = z.infer<typeof usageEntitySchema>;
