import { reset } from "drizzle-seed";
import { getDrizzle } from "./db/db";
import { catalogTable } from "./db/schema/catalog";
import { labelTable } from "./db/schema/label";
import { warehouseTable } from "./db/schema/warehouse";
import { relationTable } from "./db/schema/relation";

export async function resetDb() {
  const db = getDrizzle();

  await reset(db, {
    warehouseTable,
    catalogTable,
    relationTable,
    labelTable,
  });
}

resetDb()
  .then(async () => {
    console.info("reset finish");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
