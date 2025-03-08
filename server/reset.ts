import { reset } from "drizzle-seed";
import { getDrizzle } from "./db/db";
import { catalogTable } from "./db/schema/catalog";
import { orgTable } from "./db/schema/org";
import { questionTable } from "./db/schema/question";
import { usageTable } from "./db/schema/usage";
import { userTable } from "./db/schema/user";
import { warehouseTable } from "./db/schema/warehouse";

export async function resetDb() {
  const db = getDrizzle();

  await reset(db, {
    orgTable,
    userTable,
    warehouseTable,
    catalogTable,
    usageTable,
    questionTable,
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
