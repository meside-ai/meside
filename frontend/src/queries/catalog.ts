import { catalogApi } from "@/api";
import type { QueryClientError } from "@/utils/query-client";
import type {
  CatalogListRequest,
  CatalogListResponse,
  CatalogLoadRequest,
  CatalogLoadResponse,
  CatalogSuggestionRequest,
  CatalogSuggestionResponse,
} from "@meside/api/catalog.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type { CatalogDto } from "@meside/api/catalog.schema";

export const getCatalogList = ({
  warehouseId,
}: CatalogListRequest): UseQueryOptions<CatalogListResponse> => ({
  enabled: !!warehouseId,
  queryKey: [getCatalogList.name, warehouseId],
  queryFn: async () => {
    const res = await catalogApi.list.$post({ json: { warehouseId } });
    const json = await res.json();
    return json;
  },
});

export const getCatalogLoad = (): UseMutationOptions<
  CatalogLoadResponse,
  QueryClientError,
  CatalogLoadRequest
> => ({
  mutationKey: [getCatalogLoad.name],
  mutationFn: async ({ warehouseId }) => {
    const response = await catalogApi.load.$post({
      json: {
        warehouseId,
      },
    });
    const json = await response.json();
    return json;
  },
});

export const getCatalogSuggestion = ({
  warehouseId,
  keyword,
}: CatalogSuggestionRequest): UseQueryOptions<CatalogSuggestionResponse> => ({
  enabled: !!warehouseId && !!keyword,
  queryKey: [getCatalogSuggestion.name, warehouseId, keyword],
  queryFn: async () => {
    const res = await catalogApi.suggestion.$post({
      json: { warehouseId, keyword },
    });
    const json = await res.json();
    return json;
  },
});
