import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { primaryKeyCuid, useTimestamp } from "../utils";
import { orgTable } from "./org";
import { userTable } from "./user";

export const warehouseType = pgEnum("warehouse_type", ["postgresql"]);

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
  ownerId: text("owner_id")
    .references(() => userTable.userId)
    .notNull(),
  orgId: text("org_id")
    .references(() => orgTable.orgId)
    .notNull(),
  ...useTimestamp(),
});

export const warehouseEntitySchema = createSelectSchema(warehouseTable);

export type WarehouseEntity = z.infer<typeof warehouseEntitySchema>;
