import { Hono } from "hono";
import { authApi } from "./auth";
import { chatApi } from "./chat";
import { healthApi } from "./health";
import { llmApi } from "./llm";
import { orgApi } from "./org";
import { teamApi } from "./team";
import { threadApi } from "./thread";
import { toolApi } from "./tool";

export const agentApi = new Hono();

agentApi.route("/health", healthApi);
agentApi.route("/auth", authApi);
agentApi.route("/org", orgApi);
agentApi.route("/thread", threadApi);
agentApi.route("/llm", llmApi);
agentApi.route("/chat", chatApi);
agentApi.route("/team", teamApi);
agentApi.route("/tool", toolApi);
