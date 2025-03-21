import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  type WarehouseProvider,
  warehouseProviderSchema,
} from "../../warehouse/warehouse.type";
import { primaryKeyCuid, useTimestamp } from "../utils";

export const warehouseTable = pgTable("warehouse", {
  warehouseId: primaryKeyCuid("warehouse_id"),
  name: text("name").notNull().unique(),
  provider: jsonb("provider").notNull().$type<WarehouseProvider>(),
  ...useTimestamp(),
});

export const warehouseEntitySchema = createSelectSchema(warehouseTable, {
  provider: warehouseProviderSchema,
});

export type WarehouseEntity = z.infer<typeof warehouseEntitySchema>;
