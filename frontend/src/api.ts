import type { CatalogApiType } from "@meside/api/catalog";
import type { HealthApiType } from "@meside/api/health";
import type { LabelApiType } from "@meside/api/label";
import type { QuestionApiType } from "@meside/api/question";
import type { WarehouseApiType } from "@meside/api/warehouse";
import { api } from "./utils/request";

export const healthApi = api<HealthApiType>("/health");
export const warehouseApi = api<WarehouseApiType>("/warehouse");
export const catalogApi = api<CatalogApiType>("/catalog");
export const labelApi = api<LabelApiType>("/label");
export const questionApi = api<QuestionApiType>("/question");

export const getStreamQuestionUrl = (questionId: string) => {
  return `/meside/api/stream/question?questionId=${questionId}`;
};
