import type { CatalogApiType } from "@meside/api/catalog";
import type { ChatApiType } from "@meside/api/chat";
import type { HealthApiType } from "@meside/api/health";
import type { MessageApiType } from "@meside/api/message";
import type { QuestionApiType } from "@meside/api/question";
import type { StreamObjectRequest } from "@meside/api/stream.schema";
import type { ThreadApiType } from "@meside/api/thread";
import type { WarehouseApiType } from "@meside/api/warehouse";
import { api } from "./utils/request";

export const healthApi = api<HealthApiType>("/health");
export const warehouseApi = api<WarehouseApiType>("/warehouse");
export const catalogApi = api<CatalogApiType>("/catalog");
export const chatApi = api<ChatApiType>("/chat");
export const messageApi = api<MessageApiType>("/message");
export const threadApi = api<ThreadApiType>("/thread");
export const questionApi = api<QuestionApiType>("/question");

export const getStreamAssistantUrl = (parentThreadId: string) => {
  return `/meside/api/stream/assistant?parentThreadId=${parentThreadId}`;
};

export const getStreamQuestionUrl = (questionId: string) => {
  return `/meside/api/stream/question?questionId=${questionId}`;
};

export const getStreamObjectUrl = (body: StreamObjectRequest) => {
  const params = new URLSearchParams();
  params.set("assistantContent", body.assistantContent);
  params.set("userContent", body.userContent);
  params.set("workflowType", body.workflowType);
  params.set("debounce", body.debounce.toString());
  return `/meside/api/stream/object?${params.toString()}`;
};
