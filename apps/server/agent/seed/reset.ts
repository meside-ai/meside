import { reset } from "drizzle-seed";
import { getDrizzle } from "../../db/db";
import { agentTable } from "../table/agent";
import { agentToolTable } from "../table/agent-tool";
import { llmTable } from "../table/llm";
import { orgTable } from "../table/org";
import { orgUserTable } from "../table/org-user";
import { teamTable } from "../table/team";
import { threadTable } from "../table/thread";
import { toolTable } from "../table/tool";
import { usageTable } from "../table/usage";
import { userTable } from "../table/user";

export async function resetAgentDb() {
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
