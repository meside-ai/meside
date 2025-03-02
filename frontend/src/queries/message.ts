import { messageApi } from "@/api";
import type {
  MessageDetailRequest,
  MessageDetailResponse,
  MessageListRequest,
  MessageListResponse,
} from "@/api/message.schema";
import type { UseQueryOptions } from "@tanstack/react-query";

export type { MessageDto } from "@/api/message.schema";

export const getMessageList = ({
  parentThreadId,
  createdAtSort,
}: MessageListRequest): UseQueryOptions<MessageListResponse> => ({
  enabled: true,
  queryKey: [getMessageList.name, parentThreadId, createdAtSort],
  queryFn: async () => {
    const res = await messageApi.list.$post({
      json: {
        parentThreadId,
        createdAtSort,
      },
    });
    const json = await res.json();
    return json;
  },
});

export const getMessageDetail = ({
  messageId,
}: MessageDetailRequest): UseQueryOptions<MessageDetailResponse> => ({
  enabled: !!messageId,
  queryKey: [getMessageDetail.name, messageId],
  queryFn: async () => {
    const res = await messageApi.detail.$post({
      json: {
        messageId,
      },
    });
    const json = await res.json();
    return json;
  },
});
