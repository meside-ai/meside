import type { QueryClientError } from "@/utils/query-client";
import { createPost } from "@/utils/request";
import {
  type QuestionCreateRequest,
  type QuestionCreateResponse,
  type QuestionDetailRequest,
  type QuestionDetailResponse,
  type QuestionListRequest,
  type QuestionListResponse,
  type QuestionSummaryNameRequest,
  type QuestionSummaryNameResponse,
  questionCreateRoute,
  questionDetailRoute,
  questionListRoute,
  questionSummaryNameRoute,
} from "@meside/shared/api/question.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export const getQuestionList = ({
  parentQuestionId,
}: QuestionListRequest): UseQueryOptions<QuestionListResponse> => ({
  enabled: true,
  queryKey: [getQuestionList.name, parentQuestionId],
  queryFn: async () => {
    const json = await createPost<QuestionListRequest, QuestionListResponse>(
      `/question${questionListRoute.path}`,
    )({ parentQuestionId });
    return json;
  },
});

export const getQuestionDetail = ({
  questionId,
}: QuestionDetailRequest): UseQueryOptions<QuestionDetailResponse> => ({
  enabled: !!questionId,
  queryKey: [getQuestionDetail.name, questionId],
  queryFn: async () => {
    const json = await createPost<
      QuestionDetailRequest,
      QuestionDetailResponse
    >(`/question${questionDetailRoute.path}`)({ questionId });
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
    const json = await createPost<
      QuestionCreateRequest,
      QuestionCreateResponse
    >(`/question${questionCreateRoute.path}`)(body);
    return json;
  },
});

export const getQuestionSummaryName = (): UseMutationOptions<
  QuestionSummaryNameResponse,
  QueryClientError,
  QuestionSummaryNameRequest
> => ({
  mutationKey: [getQuestionSummaryName.name],
  mutationFn: async (body) => {
    const json = await createPost<
      QuestionSummaryNameRequest,
      QuestionSummaryNameResponse
    >(`/question${questionSummaryNameRoute.path}`)(body);
    return json;
  },
});
