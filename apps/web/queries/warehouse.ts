import {
  type WarehouseCreateRequest,
  type WarehouseCreateResponse,
  type WarehouseDetailRequest,
  type WarehouseDetailResponse,
  type WarehouseListRequest,
  type WarehouseListResponse,
  type WarehouseUpdateRequest,
  type WarehouseUpdateResponse,
  warehouseCreateRoute,
  warehouseDetailRoute,
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
