import { reset } from "drizzle-seed";
import { agentTable } from "./agent/table/agent";
import { agentToolTable } from "./agent/table/agent-tool";
import { llmTable } from "./agent/table/llm";
import { orgTable } from "./agent/table/org";
import { orgUserTable } from "./agent/table/org-user";
import { teamTable } from "./agent/table/team";
import { threadTable } from "./agent/table/thread";
import { toolTable } from "./agent/table/tool";
import { usageTable } from "./agent/table/usage";
import { userTable } from "./agent/table/user";
import { getDrizzle } from "./db/db";

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
    orgUserTable,
  });
}

resetDb()
  .then(async () => {
    console.info("reset finish");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    throw new Error("reset failed");
  });
