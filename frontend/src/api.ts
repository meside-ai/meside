import type { CatalogApiType } from "@/api/catalog";
import type { ChatApiType } from "@/api/chat";
import type { HealthApiType } from "@/api/health";
import type { MessageApiType } from "@/api/message";
import type { StreamApiType } from "@/api/stream";
import type { ThreadApiType } from "@/api/thread";
import type { WarehouseApiType } from "@/api/warehouse";
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
