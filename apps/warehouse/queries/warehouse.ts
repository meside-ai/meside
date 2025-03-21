import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";
import type {
  WarehouseCreateRequest,
  WarehouseCreateResponse,
  WarehouseDetailRequest,
  WarehouseDetailResponse,
  WarehouseListResponse,
  WarehouseUpdateRequest,
  WarehouseUpdateResponse,
} from "./warehouse.schema";

export const getWarehouseList = (): UseQueryOptions<WarehouseListResponse> => ({
  enabled: true,
  queryKey: [getWarehouseList.name],
  queryFn: async () => {
    const res = await fetch("/meside/warehouse/api/warehouse/list", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const json = await res.json();
    return json;
  },
});

export const getWarehouseDetail = ({
  warehouseId,
}: WarehouseDetailRequest): UseQueryOptions<WarehouseDetailResponse> => ({
  enabled: !!warehouseId,
  queryKey: [getWarehouseDetail.name, warehouseId],
  queryFn: async () => {
    const res = await fetch("/meside/warehouse/api/warehouse/detail", {
      method: "POST",
      body: JSON.stringify({ warehouseId }),
    });
    const json = await res.json();
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
    const res = await fetch("/meside/warehouse/api/warehouse/create", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const json = await res.json();
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
    const res = await fetch("/meside/warehouse/api/warehouse/update", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json;
  },
});
