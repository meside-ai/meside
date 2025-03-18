import type { QueryClientError } from "@/utils/query-client";
import { createPost } from "@/utils/request";
import {
  type CatalogListRequest,
  type CatalogListResponse,
  type CatalogLoadRequest,
  type CatalogLoadResponse,
  type CatalogSuggestionRequest,
  type CatalogSuggestionResponse,
  catalogListRoute,
  catalogLoadRoute,
  catalogSuggestionRoute,
} from "@meside/shared/api/catalog.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type { CatalogDto } from "@meside/shared/api/catalog.schema";

export const getCatalogList = ({
  warehouseId,
}: CatalogListRequest): UseQueryOptions<CatalogListResponse> => ({
  enabled: !!warehouseId,
  queryKey: [getCatalogList.name, warehouseId],
  queryFn: async () => {
    const json = await createPost<CatalogListRequest, CatalogListResponse>(
      catalogListRoute.path,
    )({ warehouseId });
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
    const json = await createPost<CatalogLoadRequest, CatalogLoadResponse>(
      `/catalog${catalogLoadRoute.path}`,
    )({ warehouseId });
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
    const json = await createPost<
      CatalogSuggestionRequest,
      CatalogSuggestionResponse
    >(`/catalog${catalogSuggestionRoute.path}`)({ warehouseId, keyword });
    return json;
  },
});
