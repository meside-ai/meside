import { reset } from "drizzle-seed";
import { getDrizzle } from "./db/db";
import { catalogTable } from "./db/schema/catalog";
import { messageTable } from "./db/schema/message";
import { orgTable } from "./db/schema/org";
import { threadTable } from "./db/schema/thread";
import { userTable } from "./db/schema/user";
import { warehouseTable } from "./db/schema/warehouse";

export async function resetDb() {
  const db = getDrizzle();

  await reset(db, {
    orgTable,
    userTable,
    messageTable,
    warehouseTable,
    catalogTable,
    threadTable,
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
