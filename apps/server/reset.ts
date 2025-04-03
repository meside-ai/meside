import { reset } from "drizzle-seed";
import { getDrizzle } from "./db/db";
import { agentTable } from "./db/schema/agent";
import { agentToolTable } from "./db/schema/agent-tool";
import { llmTable } from "./db/schema/llm";
import { orgTable } from "./db/schema/org";
import { teamTable } from "./db/schema/team";
import { threadTable } from "./db/schema/thread";
import { toolTable } from "./db/schema/tool";
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
    toolTable,
    teamTable,
    agentTable,
    agentToolTable,
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
