import type { CatalogApiType } from "@meside/api/catalog";
import type { ChatApiType } from "@meside/api/chat";
import type { HealthApiType } from "@meside/api/health";
import type { MessageApiType } from "@meside/api/message";
import type { StreamApiType } from "@meside/api/stream";
import type { ThreadApiType } from "@meside/api/thread";
import type { WarehouseApiType } from "@meside/api/warehouse";
import { api } from "./utils/request";

export const healthApi = api<HealthApiType>("/health");
export const warehouseApi = api<WarehouseApiType>("/warehouse");
export const catalogApi = api<CatalogApiType>("/catalog");
export const chatApi = api<ChatApiType>("/chat");
export const messageApi = api<MessageApiType>("/message");
export const threadApi = api<ThreadApiType>("/thread");
export const streamApi = api<StreamApiType>("/stream");

export const getStreamAssistantUrl = (parentThreadId: string) => {
  return `/aidw/api/stream/assistant?parentThreadId=${parentThreadId}`;
};
