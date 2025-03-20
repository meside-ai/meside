import { reset } from "drizzle-seed";
import { getDrizzle } from "./db/db";
import { orgTable } from "./db/schema/org";
import { usageTable } from "./db/schema/usage";
import { userTable } from "./db/schema/user";
import { threadTable } from "./db/schema/thread";

export async function resetDb() {
  const db = getDrizzle();

  await reset(db, {
    orgTable,
    userTable,
    usageTable,
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
