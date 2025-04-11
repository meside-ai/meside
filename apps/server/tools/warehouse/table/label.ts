import { pgTable, text, unique } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../../../db/utils";

export const labelTable = pgTable(
  "label",
  {
    labelId: primaryKeyCuid("label_id"),
    warehouseId: foreignCuid("warehouse_id").notNull(),
    catalogFullName: text("catalog_full_name").notNull(),
    jsonLabel: text("json_label"),
    orgId: foreignCuid("org_id").notNull(),
    ...useTimestamp(),
  },
  (table) => [
    unique().on(table.orgId, table.warehouseId, table.catalogFullName),
  ],
);

export const labelEntitySchema = createSelectSchema(labelTable);

export type LabelEntity = z.infer<typeof labelEntitySchema>;
