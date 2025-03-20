import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { foreignCuid, primaryKeyCuid, useTimestamp } from "../utils";

export const warehouseType = pgEnum("warehouse_type", [
  "postgresql",
  "bigquery",
  "mysql",
  "oracle",
]);

export const warehouseTable = pgTable("warehouse", {
  warehouseId: primaryKeyCuid("warehouse_id"),
  name: text("name").notNull(),
  type: warehouseType("warehouse_type").notNull(),
  host: text("host").notNull(),
  port: integer("port").notNull(),
  database: text("database").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  schema: text("schema"),
  ownerId: foreignCuid("owner_id").notNull(),
  orgId: foreignCuid("org_id").notNull(),
  ...useTimestamp(),
});

export const warehouseEntitySchema = createSelectSchema(warehouseTable);

export type WarehouseEntity = z.infer<typeof warehouseEntitySchema>;
