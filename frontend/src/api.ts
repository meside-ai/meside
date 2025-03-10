import type { CatalogApiType } from "@meside/api/catalog";
import type { HealthApiType } from "@meside/api/health";
import type { QuestionApiType } from "@meside/api/question";
import type { StreamQuestionRequest } from "@meside/api/stream.schema";
import type { WarehouseApiType } from "@meside/api/warehouse";
import { api } from "./utils/request";

export const healthApi = api<HealthApiType>("/health");
export const warehouseApi = api<WarehouseApiType>("/warehouse");
export const catalogApi = api<CatalogApiType>("/catalog");
export const questionApi = api<QuestionApiType>("/question");

// TODO: refactor to wrap event source api
export const getStreamQuestionUrl = (body: StreamQuestionRequest) => {
  const params = new URLSearchParams();
  params.set("questionId", body.questionId);
  if (body.debounce) {
    params.set("debounce", body.debounce.toString());
  }
  if (body.language) {
    params.set("language", body.language);
  }

  return `/meside/api/stream/question?${params.toString()}`;
};
