import { pgTable, text, unique } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";
import { warehouseType } from "./warehouse";

export const relationTable = pgTable(
  "relation",
  {
    relationId: primaryKeyCuid("relation_id"),
    warehouseId: foreignCuid("warehouse_id").notNull(),
    warehouseType: warehouseType("warehouse_type").notNull(),
    fullName: text("full_name").notNull(),
    schemaName: text("schema_name").notNull(),
    tableName: text("table_name").notNull(),
    columnName: text("column_name").notNull(),
    foreignFullName: text("foreign_full_name").notNull(),
    foreignSchemaName: text("foreign_schema_name").notNull(),
    foreignTableName: text("foreign_table_name").notNull(),
    foreignColumnName: text("foreign_column_name").notNull(),
    orgId: foreignCuid("org_id").notNull(),
    ...useTimestamp(),
  },
  (t) => [unique().on(t.fullName, t.foreignFullName)],
);

export const relationEntitySchema = createSelectSchema(relationTable);

export type RelationEntity = z.infer<typeof relationEntitySchema>;
