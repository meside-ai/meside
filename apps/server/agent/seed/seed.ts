import { createInterface } from "node:readline";
import type { LlmProvider } from "@meside/shared/api/llm.schema";
import { getDrizzle } from "../../db/db";
import { cuid } from "../../utils/cuid";
import { initApplicationData } from "../initial/initial";
import { llmTable } from "../table/llm";
import { orgTable } from "../table/org";
import { threadTable } from "../table/thread";
import { userTable } from "../table/user";

export async function seedAgentDb({
  llmProvider,
  toolUrl,
}: {
  llmProvider: LlmProvider;
  toolUrl: string;
}) {
  const db = getDrizzle();

  const orgId = "org-x29khaflgmm5c8ipp79r";
  const userId = "user-027z7qwd25mzq6upq947";
  const threadId = "thread-4nxuh3xlhnlouz95q7";
  const llmId = "llm-71ci4hwucgons4wvqpam";
  const teamId = "team-v4nxuh3xlhnlouz95q8";
  const toolId = "tool-v4nxuh3xlhnlouz95q9";

  await db.insert(orgTable).values({
    orgId,
    name: "chinook",
  });

  await db.insert(userTable).values({
    userId,
    name: "Admin",
    email: "admin@meside.com",
    passwordHash:
      "4053f524e9e06d5b8f553ab467797afd33601c95c83e90a1f577a9d7691a0e6c.1de7f38311a94d69b4670175565c0ea9",
  });

  await db.insert(threadTable).values({
    threadId,
    teamId,
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
    teamId,
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
    teamId,
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
    teamId,
    toolId,
  });
}

export async function inputKey() {
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

  const defaultToolUrl = "/meside/warehouse/internal";
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
