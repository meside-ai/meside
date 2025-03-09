import {
  getQuestionDetail,
  getQuestionList,
  getQuestionSummaryName,
} from "@/queries/question";
import { Box, ScrollArea, Skeleton } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { usePreviewContext } from "../preview/preview-context";
import { WorkflowFactory } from "../workflow/workflow-factory";
import { useQuestionContext } from "./context";
import { QuestionLayout } from "./question-layout";
import { useStreamAnswer } from "./use-stream-answer";

export const ChatPanel = () => {
  const { questionId, questionCache, setQuestionCache } = useQuestionContext();
  const { openPreview } = usePreviewContext();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    getQuestionDetail({
      questionId: questionId ?? "",
    })
  );

  const { mutateAsync: questionSummaryName } = useMutation({
    ...getQuestionSummaryName(),
    onSuccess: () => {
      queryClient.invalidateQueries(getQuestionList({}));
    },
  });

  const { streamAnswer, isGettingAnswer, answerError } = useStreamAnswer({
    onCompleted: (data) => {
      if (data) {
        questionSummaryName({
          questionId: data.questionId,
        });
      }
    },
  });

  useEffect(() => {
    openPreview({
      name: questionCache?.shortName ?? "Question Preview",
      payload: {
        type: "previewQuestion",
        questionId: questionId ?? "",
      },
    });

    if (!questionCache) {
      return;
    }
    if (questionCache.questionId === questionId) {
      setQuestionCache(null);
      streamAnswer(questionId);
    } else {
      setQuestionCache(null);
    }
  }, [questionId, questionCache, setQuestionCache, streamAnswer, openPreview]);

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      style={{ flexDirection: "column", overflow: "hidden" }}
    >
      <Box flex={1} style={{ overflow: "hidden" }}>
        <ScrollArea h="100%" style={{ overflow: "hidden" }}>
          <Box mt="md" />
          {isLoading && (
            <Box>
              <Skeleton h={40} />
            </Box>
          )}
          {data?.question && (
            <WorkflowFactory
              question={data.question}
              isGettingAnswer={isGettingAnswer}
              answerError={answerError ?? undefined}
              openPreview={openPreview}
              injectedQuestionLayout={QuestionLayout}
            />
          )}
          <Box h={40} />
        </ScrollArea>
      </Box>
    </Box>
  );
};
