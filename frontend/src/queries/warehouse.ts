import { warehouseApi } from "@/api";
import type { QueryClientError } from "@/utils/query-client";
import type {
  WarehouseCreateRequest,
  WarehouseCreateResponse,
  WarehouseDetailRequest,
  WarehouseDetailResponse,
  WarehouseExecuteRequest,
  WarehouseExecuteResponse,
  WarehouseListResponse,
} from "@meside/api/warehouse.schema";
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
    const res = await warehouseApi.execute.$post({
      json: {
        questionId,
      },
    });
    const json = await res.json();
    return json;
  },
});

export const getWarehouseList = (): UseQueryOptions<WarehouseListResponse> => ({
  enabled: true,
  queryKey: [getWarehouseList.name],
  queryFn: async () => {
    const res = await warehouseApi.list.$post({
      json: {},
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
    const res = await warehouseApi.detail.$post({
      json: {
        warehouseId,
      },
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
    const response = await warehouseApi.create.$post({
      json: body,
    });
    const json = await response.json();
    return json;
  },
});
