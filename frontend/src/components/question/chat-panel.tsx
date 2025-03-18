import {
  getQuestionDetail,
  getQuestionList,
  getQuestionSummaryName,
} from "@/queries/question";
import { Box, ScrollArea, Skeleton, Stack } from "@mantine/core";
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
    }),
  );

  const { mutateAsync: questionSummaryName } = useMutation({
    ...getQuestionSummaryName(),
    onSuccess: () => {
      queryClient.invalidateQueries(getQuestionList({}));
    },
  });

  const { streamAnswer, isGettingAnswer, answerError } = useStreamAnswer();

  useEffect(() => {
    // @remark this branch means the question was opened in menu
    if (!questionCache) {
      openPreview({
        name: "Question Preview",
        payload: {
          type: "previewQuestion",
          questionId: questionId ?? "",
        },
      });
      return;
    }
    if (questionCache.questionId === questionId) {
      // @remark this branch means the question was created and redirected to this page
      // and getting assistant answer
      setQuestionCache(null);
      streamAnswer(questionId).then((data) => {
        openPreview({
          name: "Question Preview",
          payload: {
            type: "previewQuestion",
            questionId: questionId ?? "",
          },
        });

        queryClient.invalidateQueries(
          getQuestionDetail({
            questionId: questionId ?? "",
          }),
        );

        if (data.questionId) {
          questionSummaryName({
            questionId: data.questionId,
          });
        }
      });
    } else {
      // @remark this branch means cache error happened, so clear the cache
      setQuestionCache(null);
      throw new Error("Question cache error");
    }
  }, [
    questionId,
    questionCache,
    setQuestionCache,
    streamAnswer,
    openPreview,
    questionSummaryName,
    queryClient,
  ]);

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
            <Stack p="md">
              <Skeleton height={50} circle mb="md" />
              <Skeleton height={12} radius="xl" w="60%" />
              <Skeleton height={12} radius="xl" w="100%" />
              <Skeleton height={12} radius="xl" w="60%" />
            </Stack>
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
