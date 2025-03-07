import { getQuestionCreate, getQuestionDetail } from "@/queries/question";
import type { QuestionCreateRequest } from "@meside/api/question.schema";
import type { EditorJSONContent } from "@meside/shared/editor-json-to-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useQuestionContext } from "./context";

export const useSendQuestion = ({
  parentQuestionId,
  questionPayload,
}: {
  parentQuestionId: string | null;
  questionPayload: QuestionCreateRequest["payload"];
}) => {
  const queryClient = useQueryClient();
  const { setQuestionCache, setQuestionId } = useQuestionContext();

  const { mutateAsync: sendQuestion, isPending: isSendingQuestion } =
    useMutation({
      ...getQuestionCreate(),
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          getQuestionDetail({ questionId: data.question.questionId })
        );
      },
    });

  const handleQuestion = useCallback(
    async (json: EditorJSONContent) => {
      const text = JSON.stringify(json);

      const { question } = await sendQuestion({
        versionId: null,
        userContent: text,
        payload: questionPayload,
        parentQuestionId,
      });

      setQuestionCache(question);
      setQuestionId(question.questionId);
    },
    [
      parentQuestionId,
      questionPayload,
      sendQuestion,
      setQuestionCache,
      setQuestionId,
    ]
  );

  return {
    handleQuestion,
    isSendingQuestion,
  };
};
