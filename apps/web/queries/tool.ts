import {
  type ToolCreateRequest,
  type ToolCreateResponse,
  type ToolDetailRequest,
  type ToolDetailResponse,
  type ToolListRequest,
  type ToolListResponse,
  type ToolUpdateRequest,
  type ToolUpdateResponse,
  llmDetailRoute,
  toolCreateRoute,
  toolListRoute,
  toolUpdateRoute,
} from "@meside/shared/api/tool.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";
import { createPost } from "../utils/request";

export const getToolList = (
  params: ToolListRequest,
): UseQueryOptions<ToolListResponse> => ({
  enabled: true,
  queryKey: [getToolList.name],
  queryFn: async () => {
    const json = await createPost<ToolListRequest, ToolListResponse>(
      `/meside/server/tool${toolListRoute.path}`,
    )(params);
    return json;
  },
});

export const getToolDetail = ({
  toolId,
}: ToolDetailRequest): UseQueryOptions<ToolDetailResponse> => ({
  enabled: !!toolId,
  queryKey: [getToolDetail.name, toolId],
  queryFn: async () => {
    const json = await createPost<ToolDetailRequest, ToolDetailResponse>(
      `/meside/server/tool${llmDetailRoute.path}`,
    )({ toolId });
    return json;
  },
});

export const getToolCreate = (): UseMutationOptions<
  ToolCreateResponse,
  QueryClientError,
  ToolCreateRequest
> => ({
  mutationKey: [getToolCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<ToolCreateRequest, ToolCreateResponse>(
      `/meside/server/tool${toolCreateRoute.path}`,
    )(body);
    return json;
  },
});

export const getToolUpdate = (): UseMutationOptions<
  ToolUpdateResponse,
  QueryClientError,
  ToolUpdateRequest
> => ({
  mutationKey: [getToolUpdate.name],
  mutationFn: async (body) => {
    const json = await createPost<ToolUpdateRequest, ToolUpdateResponse>(
      `/meside/server/tool${toolUpdateRoute.path}`,
    )(body);
    return json;
  },
});
