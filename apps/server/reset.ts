import { reset } from "drizzle-seed";
import { getDrizzle } from "./db/db";
import { llmTable } from "./db/schema/llm";
import { orgTable } from "./db/schema/org";
import { threadTable } from "./db/schema/thread";
import { usageTable } from "./db/schema/usage";
import { userTable } from "./db/schema/user";

export async function resetDb() {
  const db = getDrizzle();

  await reset(db, {
    orgTable,
    userTable,
    usageTable,
    threadTable,
    llmTable,
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
