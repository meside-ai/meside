import {
  type WarehouseCreateRequest,
  type WarehouseCreateResponse,
  type WarehouseDetailRequest,
  type WarehouseDetailResponse,
  type WarehouseExecuteQueryRequest,
  type WarehouseExecuteQueryResponse,
  type WarehouseGetQueryRequest,
  type WarehouseGetQueryResponse,
  type WarehouseListRequest,
  type WarehouseListResponse,
  type WarehouseUpdateRequest,
  type WarehouseUpdateResponse,
  warehouseCreateRoute,
  warehouseDetailRoute,
  warehouseExecuteQueryRoute,
  warehouseGetQueryRoute,
  warehouseListRoute,
  warehouseUpdateRoute,
} from "@meside/shared/api/warehouse.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";
import { createPost } from "../utils/request";

export const getWarehouseList = (
  params: WarehouseListRequest,
): UseQueryOptions<WarehouseListResponse> => ({
  enabled: true,
  queryKey: [getWarehouseList.name],
  queryFn: async () => {
    const json = await createPost<WarehouseListRequest, WarehouseListResponse>(
      `/meside/warehouse/warehouse${warehouseListRoute.path}`,
    )(params);
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
    >(`/meside/warehouse/warehouse${warehouseDetailRoute.path}`)({
      warehouseId,
    });
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
    >(`/meside/warehouse/warehouse${warehouseCreateRoute.path}`)(body);
    return json;
  },
});

export const getWarehouseUpdate = (): UseMutationOptions<
  WarehouseUpdateResponse,
  QueryClientError,
  WarehouseUpdateRequest
> => ({
  mutationKey: [getWarehouseUpdate.name],
  mutationFn: async (body) => {
    const json = await createPost<
      WarehouseUpdateRequest,
      WarehouseUpdateResponse
    >(`/meside/warehouse/warehouse${warehouseUpdateRoute.path}`)(body);
    return json;
  },
});

export const getWarehouseQuery = (
  queryId: string,
): UseQueryOptions<WarehouseGetQueryResponse> => ({
  enabled: !!queryId,
  queryKey: [getWarehouseQuery.name, queryId],
  queryFn: async () => {
    const json = await createPost<
      WarehouseGetQueryRequest,
      WarehouseGetQueryResponse
    >(`/meside/warehouse/warehouse${warehouseGetQueryRoute.path}`)({ queryId });
    return json;
  },
});

export const getWarehouseExecuteQuery = (
  queryId: string,
): UseQueryOptions<WarehouseExecuteQueryResponse> => ({
  enabled: !!queryId,
  queryKey: [getWarehouseExecuteQuery.name, queryId],
  queryFn: async () => {
    const json = await createPost<
      WarehouseExecuteQueryRequest,
      WarehouseExecuteQueryResponse
    >(`/meside/warehouse/warehouse${warehouseExecuteQueryRoute.path}`)({
      queryId,
    });
    return json;
  },
});
