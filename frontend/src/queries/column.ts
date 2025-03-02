import { columnApi } from "@/api";
import type {
  ColumnListRequest,
  ColumnListResponse,
  ColumnLoadRequest,
  ColumnLoadResponse,
  ColumnSuggestionRequest,
  ColumnSuggestionResponse,
} from "@/api/column.schema";
import type { QueryClientError } from "@/utils/query-client";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export const getColumnList = ({
  warehouseId,
}: ColumnListRequest): UseQueryOptions<ColumnListResponse> => ({
  enabled: !!warehouseId,
  queryKey: [getColumnList.name, warehouseId],
  queryFn: async () => {
    const res = await columnApi.list.$post({ json: { warehouseId } });
    const json = await res.json();
    return json;
  },
});

export const getColumnLoad = (): UseMutationOptions<
  ColumnLoadResponse,
  QueryClientError,
  ColumnLoadRequest
> => ({
  mutationKey: [getColumnLoad.name],
  mutationFn: async ({ warehouseId }) => {
    const response = await columnApi.load.$post({
      json: {
        warehouseId,
      },
    });
    const json = await response.json();
    return json;
  },
});

export const getColumnSuggestion = ({
  warehouseId,
  keyword,
}: ColumnSuggestionRequest): UseQueryOptions<ColumnSuggestionResponse> => ({
  enabled: !!warehouseId && !!keyword,
  queryKey: [getColumnSuggestion.name, warehouseId, keyword],
  queryFn: async () => {
    const res = await columnApi.suggestion.$post({
      json: { warehouseId, keyword },
    });
    const json = await res.json();
    return json;
  },
});
