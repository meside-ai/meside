import {
  type ThreadCreateRequest,
  type ThreadCreateResponse,
  type ThreadDetailRequest,
  type ThreadDetailResponse,
  type ThreadListRequest,
  type ThreadListResponse,
  type ThreadUpdateRequest,
  type ThreadUpdateResponse,
  threadCreateRoute,
  threadDetailRoute,
  threadListRoute,
  threadUpdateRoute,
} from "@meside/shared/api/thread.schema";
import { createPost } from "@meside/shared/request/index";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";

export const getThreadList = ({
  parentThreadId,
}: ThreadListRequest): UseQueryOptions<ThreadListResponse> => ({
  enabled: true,
  queryKey: [getThreadList.name, parentThreadId],
  queryFn: async () => {
    const json = await createPost<ThreadListRequest, ThreadListResponse>(
      `/meside/server/thread${threadListRoute.path}`,
    )({ parentThreadId });
    return json;
  },
});

export const getThreadDetail = ({
  threadId,
}: ThreadDetailRequest): UseQueryOptions<ThreadDetailResponse> => ({
  enabled: !!threadId,
  queryKey: [getThreadDetail.name, threadId],
  queryFn: async () => {
    const json = await createPost<ThreadDetailRequest, ThreadDetailResponse>(
      `/meside/server/thread${threadDetailRoute.path}`,
    )({ threadId });
    return json;
  },
});

export const getThreadCreate = (): UseMutationOptions<
  ThreadCreateResponse,
  QueryClientError,
  ThreadCreateRequest
> => ({
  mutationKey: [getThreadCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<ThreadCreateRequest, ThreadCreateResponse>(
      `/meside/server/thread${threadCreateRoute.path}`,
    )(body);
    return json;
  },
});

export const getThreadUpdate = (): UseMutationOptions<
  ThreadUpdateResponse,
  QueryClientError,
  ThreadUpdateRequest
> => ({
  mutationKey: [getThreadCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<ThreadUpdateRequest, ThreadUpdateResponse>(
      `/meside/server/thread${threadUpdateRoute.path}`,
    )(body);
    return json;
  },
});
