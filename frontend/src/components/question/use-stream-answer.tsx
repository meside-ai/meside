import { getQuestionDetail } from "@/queries/question";
import type { QuestionDetailResponse } from "@meside/api/question.schema";
import type { StreamQuestionResponse } from "@meside/api/stream.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useQuestionStream } from "./use-question-stream";

export const useStreamAnswer = () => {
  const queryClient = useQueryClient();

  const {
    stream,
    isLoading: isGettingAnswer,
    error: answerError,
  } = useQuestionStream();

  const streamAnswer = useCallback(
    (questionId: string) => {
      const question: StreamQuestionResponse | object = {};

      return new Promise<StreamQuestionResponse>((resolve) => {
        stream(questionId, (messageChunk, done) => {
          if (done) {
            resolve(question as StreamQuestionResponse);
            return;
          }
          if (!messageChunk) {
            return;
          }
          Object.assign(question, messageChunk);
          queryClient.setQueryData(
            getQuestionDetail({
              questionId: questionId,
            }).queryKey,
            (prev: QuestionDetailResponse | undefined) => {
              if (!prev?.question) {
                return prev;
              }
              if (prev.question.questionId !== questionId) {
                return prev;
              }
              return {
                ...prev,
                question: {
                  ...prev.question,
                  assistantContent: messageChunk.assistantContent,
                  assistantReason: messageChunk.assistantReason,
                  payload: messageChunk.payload,
                },
              } as QuestionDetailResponse;
            }
          );
        });
      });
    },
    [queryClient, stream]
  );

  return {
    streamAnswer,
    isGettingAnswer,
    answerError,
  };
};
