import {
  type LlmCreateRequest,
  type LlmCreateResponse,
  type LlmDetailRequest,
  type LlmDetailResponse,
  type LlmListRequest,
  type LlmListResponse,
  type LlmUpdateRequest,
  type LlmUpdateResponse,
  llmCreateRoute,
  llmDetailRoute,
  llmListRoute,
  llmUpdateRoute,
} from "@meside/shared/api/llm.schema";
import { createPost } from "@meside/shared/request/index";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";

export const getLlmList = (
  params: LlmListRequest,
): UseQueryOptions<LlmListResponse> => ({
  enabled: true,
  queryKey: [getLlmList.name],
  queryFn: async () => {
    const json = await createPost<LlmListRequest, LlmListResponse>(
      `${llmListRoute.path}`,
    )(params);
    return json;
  },
});

export const getLlmDetail = ({
  llmId,
}: LlmDetailRequest): UseQueryOptions<LlmDetailResponse> => ({
  enabled: !!llmId,
  queryKey: [getLlmDetail.name, llmId],
  queryFn: async () => {
    const json = await createPost<LlmDetailRequest, LlmDetailResponse>(
      `${llmDetailRoute.path}`,
    )({ llmId });
    return json;
  },
});

export const getLlmCreate = (): UseMutationOptions<
  LlmCreateResponse,
  QueryClientError,
  LlmCreateRequest
> => ({
  mutationKey: [getLlmCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<LlmCreateRequest, LlmCreateResponse>(
      `${llmCreateRoute.path}`,
    )(body);
    return json;
  },
});

export const getLlmUpdate = (): UseMutationOptions<
  LlmUpdateResponse,
  QueryClientError,
  LlmUpdateRequest
> => ({
  mutationKey: [getLlmUpdate.name],
  mutationFn: async (body) => {
    const json = await createPost<LlmUpdateRequest, LlmUpdateResponse>(
      `${llmUpdateRoute.path}`,
    )(body);
    return json;
  },
});
