import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { warehouseQueryColumnSchema } from "../../warehouse/warehouse.type";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const queryTable = pgTable("query", {
  queryId: primaryKeyCuid("query_id"),
  warehouseId: foreignCuid("warehouse_id").notNull(),
  sql: text("sql").notNull(),
  fields: jsonb("fields").notNull(),
  ...useTimestamp(),
});

export const queryEntitySchema = createSelectSchema(queryTable, {
  fields: z.array(warehouseQueryColumnSchema),
});

export type QueryEntity = z.infer<typeof queryEntitySchema>;
