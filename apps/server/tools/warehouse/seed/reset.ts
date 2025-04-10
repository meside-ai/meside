import { reset } from "drizzle-seed";
import { getDrizzle } from "../../../db/db";
import { catalogTable } from "../table/catalog";
import { labelTable } from "../table/label";
import { relationTable } from "../table/relation";
import { warehouseTable } from "../table/warehouse";

export async function resetWarehouseDb() {
  const db = getDrizzle();

  await reset(db, {
    warehouseTable,
    catalogTable,
    relationTable,
    labelTable,
  });
}
