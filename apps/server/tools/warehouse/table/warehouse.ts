import {
  type WarehouseProvider,
  warehouseProviderSchema,
} from "@meside/shared/api/warehouse.schema";
import { jsonb, pgTable, text, unique } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../../../db/utils";

export const warehouseTable = pgTable(
  "warehouse",
  {
    warehouseId: primaryKeyCuid("warehouse_id"),
    name: text("name").notNull(),
    provider: jsonb("provider").notNull().$type<WarehouseProvider>(),
    ownerId: foreignCuid("owner_id").notNull(),
    orgId: foreignCuid("org_id").notNull(),
    ...useTimestamp(),
  },
  (table) => [unique().on(table.orgId, table.name)],
);

export const warehouseEntitySchema = createSelectSchema(warehouseTable, {
  provider: warehouseProviderSchema,
});

export type WarehouseEntity = z.infer<typeof warehouseEntitySchema>;
