import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const columnModel = pgTable("column", {
  columnId: primaryKeyCuid("column_id"),
  warehouseId: foreignCuid("warehouse_id").notNull(),
  tableName: text("table_name").notNull(),
  columnName: text("column_name").notNull(),
  columnType: text("column_type").notNull(),
  description: text("description"),
  ...useTimestamp(),
});

export const columnModelSchema = createSelectSchema(columnModel);

export type ColumnModel = z.infer<typeof columnModelSchema>;
