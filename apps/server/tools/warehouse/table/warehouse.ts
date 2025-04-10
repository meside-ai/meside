import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { primaryKeyCuid, useTimestamp } from "../../../db/utils";
import {
  type WarehouseProvider,
  warehouseProviderSchema,
} from "../factory/warehouse.type";

export const warehouseTable = pgTable("warehouse", {
  warehouseId: primaryKeyCuid("warehouse_id"),
  name: text("name").notNull(),
  provider: jsonb("provider").notNull().$type<WarehouseProvider>(),
  ...useTimestamp(),
});

export const warehouseEntitySchema = createSelectSchema(warehouseTable, {
  provider: warehouseProviderSchema,
});

export type WarehouseEntity = z.infer<typeof warehouseEntitySchema>;
