import { getDrizzle } from "./db/db";
import { orgTable } from "./db/schema/org";
import { threadTable } from "./db/schema/thread";
import { userTable } from "./db/schema/user";
import { cuid } from "./utils/cuid";

export async function main() {
  const db = getDrizzle();

  const orgId = "hkwgx29khaflgmm5c8ipp79r";
  const userId = "io56027z7qwd25mzq6upq947";
  const threadId = "cwh5pv4nxuh3xlhnlouz95q7";

  await db.insert(orgTable).values({
    orgId,
    name: "chinook",
  });

  await db.insert(userTable).values({
    userId,
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password",
  });

  await db.insert(threadTable).values({
    threadId,
    versionId: threadId,
    ownerId: userId,
    orgId,
    shortName: "list all artists",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "list all artists",
    messages: [],
    status: "idle",
    parentThreadId: null,
  });

  await db.insert(threadTable).values({
    threadId: cuid(),
    versionId: threadId,
    activeVersion: true,
    ownerId: userId,
    orgId,
    shortName: "list all albums",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "list all albums",
    messages: [],
    status: "idle",
    parentThreadId: null,
  });

  await db.insert(threadTable).values({
    threadId: cuid(),
    versionId: threadId,
    ownerId: userId,
    orgId,
    shortName: "list all tracks",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "list all tracks",
    messages: [],
    status: "idle",
    parentThreadId: null,
  });
}

main()
  .then(async () => {
    console.info("seed finish");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
