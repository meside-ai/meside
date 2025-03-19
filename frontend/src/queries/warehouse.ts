import type { QueryClientError } from "@/utils/query-client";
import { createPost } from "@/utils/request";
import {
  type WarehouseCreateRequest,
  type WarehouseCreateResponse,
  type WarehouseDetailRequest,
  type WarehouseDetailResponse,
  type WarehouseExecuteRequest,
  type WarehouseExecuteResponse,
  type WarehouseListRequest,
  type WarehouseListResponse,
  warehouseCreateRoute,
  warehouseDetailRoute,
  warehouseExecuteRoute,
  warehouseListRoute,
} from "@meside/shared/api/warehouse.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type WarehouseQueryRow = WarehouseExecuteResponse["rows"][number];
export type WarehouseQueryColumn = WarehouseExecuteResponse["fields"][number];

export const getWarehouseExecute = ({
  questionId,
}: WarehouseExecuteRequest): UseQueryOptions<WarehouseExecuteResponse> => ({
  enabled: !!questionId,
  queryKey: [getWarehouseExecute.name, questionId],
  queryFn: async () => {
    const json = await createPost<
      WarehouseExecuteRequest,
      WarehouseExecuteResponse
    >(`/warehouse${warehouseExecuteRoute.path}`)({ questionId });
    return json;
  },
});

export const getWarehouseList = (): UseQueryOptions<WarehouseListResponse> => ({
  enabled: true,
  queryKey: [getWarehouseList.name],
  queryFn: async () => {
    const json = await createPost<WarehouseListRequest, WarehouseListResponse>(
      `/warehouse${warehouseListRoute.path}`,
    )({});
    return json;
  },
});

export const getWarehouseDetail = ({
  warehouseId,
}: WarehouseDetailRequest): UseQueryOptions<WarehouseDetailResponse> => ({
  enabled: !!warehouseId,
  queryKey: [getWarehouseDetail.name, warehouseId],
  queryFn: async () => {
    const json = await createPost<
      WarehouseDetailRequest,
      WarehouseDetailResponse
    >(`/warehouse${warehouseDetailRoute.path}`)({ warehouseId });
    return json;
  },
});

export const getWarehouseCreate = (): UseMutationOptions<
  WarehouseCreateResponse,
  QueryClientError,
  WarehouseCreateRequest
> => ({
  mutationKey: [getWarehouseCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<
      WarehouseCreateRequest,
      WarehouseCreateResponse
    >(`/warehouse${warehouseCreateRoute.path}`)(body);
    return json;
  },
});
