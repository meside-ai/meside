import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../../../db/utils";

export const catalogTable = pgTable("catalog", {
  catalogId: primaryKeyCuid("catalog_id"),
  warehouseId: foreignCuid("warehouse_id").notNull(),
  fullName: text("full_name").notNull().unique(),
  schemaName: text("schema_name").notNull(),
  tableName: text("table_name").notNull(),
  columnName: text("column_name").notNull(),
  columnType: text("column_type").notNull(),
  description: text("description"),
  orgId: foreignCuid("org_id").notNull(),
  ...useTimestamp(),
});

export const catalogEntitySchema = createSelectSchema(catalogTable);

export type CatalogEntity = z.infer<typeof catalogEntitySchema>;
