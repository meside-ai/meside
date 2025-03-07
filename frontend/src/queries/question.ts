import { questionApi } from "@/api";
import type { QueryClientError } from "@/utils/query-client";
import type {
  QuestionCreateRequest,
  QuestionCreateResponse,
  QuestionDetailRequest,
  QuestionDetailResponse,
  QuestionListRequest,
  QuestionListResponse,
} from "@meside/api/question.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type { MessageDto } from "@meside/api/message.schema";

export const getQuestionList = ({
  parentQuestionId,
}: QuestionListRequest): UseQueryOptions<QuestionListResponse> => ({
  enabled: true,
  queryKey: [getQuestionList.name, parentQuestionId],
  queryFn: async () => {
    const res = await questionApi.list.$post({
      json: {
        parentQuestionId,
      },
    });
    const json = await res.json();
    return json;
  },
});

export const getQuestionDetail = ({
  questionId,
}: QuestionDetailRequest): UseQueryOptions<QuestionDetailResponse> => ({
  enabled: !!questionId,
  queryKey: [getQuestionDetail.name, questionId],
  queryFn: async () => {
    const res = await questionApi.detail.$post({
      json: {
        questionId,
      },
    });
    const json = await res.json();
    return json;
  },
});

export const getQuestionCreate = (): UseMutationOptions<
  QuestionCreateResponse,
  QueryClientError,
  QuestionCreateRequest
> => ({
  mutationKey: [getQuestionCreate.name],
  mutationFn: async (body) => {
    const response = await questionApi.create.$post({
      json: body,
    });
    const json = await response.json();
    return json;
  },
});
