import type { QueryClientError } from "../utils/query-client";
import { createPost } from "@meside/shared/request/index";
import {
  type ThreadCreateRequest,
  type ThreadCreateResponse,
  type ThreadDetailRequest,
  type ThreadDetailResponse,
  type ThreadListRequest,
  type ThreadListResponse,
  ThreadUpdateRequest,
  ThreadUpdateResponse,
  threadCreateRoute,
  threadDetailRoute,
  threadListRoute,
  threadUpdateRoute,
} from "@meside/shared/api/thread.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export const getThreadList = ({
  parentThreadId,
}: ThreadListRequest): UseQueryOptions<ThreadListResponse> => ({
  enabled: true,
  queryKey: [getThreadList.name, parentThreadId],
  queryFn: async () => {
    const json = await createPost<ThreadListRequest, ThreadListResponse>(
      `${threadListRoute.path}`
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
      `${threadDetailRoute.path}`
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
      `${threadCreateRoute.path}`
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
      `${threadUpdateRoute.path}`
    )(body);
    return json;
  },
});
