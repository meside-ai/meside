import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../../../db/utils";
import { warehouseQueryColumnSchema } from "../factory/warehouse.type";

export const queryTable = pgTable("query", {
  queryId: primaryKeyCuid("query_id"),
  warehouseId: foreignCuid("warehouse_id").notNull(),
  sql: text("sql").notNull(),
  fields: jsonb("fields").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  ownerId: foreignCuid("owner_id").notNull(),
  ...useTimestamp(),
});

export const queryEntitySchema = createSelectSchema(queryTable, {
  fields: z.array(warehouseQueryColumnSchema),
});

export type QueryEntity = z.infer<typeof queryEntitySchema>;
