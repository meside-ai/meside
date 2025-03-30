import { createInterface } from "node:readline";
import type { LlmProvider } from "@meside/shared/api/llm.schema";
import { getDrizzle } from "./db/db";
import { llmTable } from "./db/schema/llm";
import { orgTable } from "./db/schema/org";
import { threadTable } from "./db/schema/thread";
import { userTable } from "./db/schema/user";
import { initApplicationData } from "./initial/initial";
import { cuid } from "./utils/cuid";

async function inputKey() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  };

  let provider: LlmProvider["provider"] = "openai";
  let model: LlmProvider["model"] = "gpt-4o";
  let toolUrl = "";

  while (true) {
    const choice = await question(
      "Choose LLM provider (1 for OpenAI gpt-4o, 2 for Deepseek deepseek-chat): ",
    );
    if (choice === "1") {
      provider = "openai";
      model = "gpt-4o";
      break;
    }
    if (choice === "2") {
      provider = "deepseek";
      model = "deepseek-chat";
      break;
    }
    console.log("Invalid choice. Please enter 1 or 2.");
  }

  const apiKey = await question("Please enter your API key: ");

  const defaultToolUrl = "http://localhost:3002/meside/warehouse/api/http";
  toolUrl = await question(
    `Please enter your tool url: (default: ${defaultToolUrl})`,
  );
  rl.close();

  const llmProvider: LlmProvider = {
    provider,
    apiKey,
    model,
  } as LlmProvider;

  return {
    llmProvider,
    toolUrl: toolUrl || defaultToolUrl,
  };
}

export async function main() {
  const db = getDrizzle();
  const { llmProvider, toolUrl } = await inputKey();

  const orgId = "hkwgx29khaflgmm5c8ipp79r";
  const userId = "io56027z7qwd25mzq6upq947";
  const threadId = "cwh5pv4nxuh3xlhnlouz95q7";
  const llmId = "edbp71ci4hwucgons4wvqpam";
  const teamId = "cwh5pv4nxuh3xlhnlouz95q8";

  await db.insert(orgTable).values({
    orgId,
    name: "chinook",
  });

  await db.insert(userTable).values({
    userId,
    name: "John Doe",
    email: "john.doe@example.com",
    passwordHash: "",
  });

  await db.insert(threadTable).values({
    threadId,
    versionId: threadId,
    ownerId: userId,
    orgId,
    shortName: "list all artists",
    renameCount: 1,
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
    renameCount: 1,
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
    renameCount: 1,
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "list all tracks",
    messages: [],
    status: "idle",
    parentThreadId: null,
  });

  await db.insert(llmTable).values({
    llmId,
    name: llmProvider.model,
    provider: llmProvider,
    isDefault: true,
    ownerId: userId,
    orgId,
  });

  await initApplicationData({
    ownerId: userId,
    orgId,
    toolUrl,
    llmId,
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
