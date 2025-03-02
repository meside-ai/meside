import { threadApi } from "@/api";
import type {
  ThreadCreateResponse,
  ThreadListRequest,
  ThreadListResponse,
} from "@/api/thread.schema";
import type { ThreadCreateRequest } from "@/api/thread.schema";
import type { QueryClientError } from "@/utils/query-client";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type { ThreadDto } from "@/api/thread.schema";

export const getThreadList = ({
  threadId,
  parentMessageId,
  createdAtSort,
}: ThreadListRequest): UseQueryOptions<ThreadListResponse> => ({
  enabled: true,
  queryKey: [getThreadList.name, threadId, parentMessageId, createdAtSort],
  queryFn: async () => {
    const res = await threadApi.list.$post({
      json: {
        threadId,
        parentMessageId,
        createdAtSort,
      },
    });
    const json = await res.json();
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
    const response = await threadApi.create.$post({
      json: body,
    });
    const json = await response.json();
    return json;
  },
});
