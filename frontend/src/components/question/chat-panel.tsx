import { getQuestionDetail } from "@/queries/question";
import { Box, Loader, ScrollArea, Skeleton, Text } from "@mantine/core";
import type { QuestionDto } from "@meside/api/question.schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQuestionContext } from "./context";
import { useStreamAnswer } from "./use-stream-answer";

export const ChatPanel = () => {
  const { questionId, questionCache, setQuestionCache } = useQuestionContext();

  const { data, isLoading } = useQuery(
    getQuestionDetail({
      questionId: questionId ?? "",
    })
  );

  const { streamAnswer, isGettingAnswer, answerError } = useStreamAnswer();

  useEffect(() => {
    console.log("questionCache", questionCache);
    if (!questionCache) {
      return;
    }
    console.log(questionCache.questionId === questionId);
    if (questionCache.questionId === questionId) {
      setQuestionCache(null);
      streamAnswer(questionId);
    } else {
      setQuestionCache(null);
    }
  }, [questionId, questionCache, setQuestionCache, streamAnswer]);

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
          {data?.question && <QuestionDetail question={data.question} />}
          {isGettingAnswer && (
            <Box>
              <Loader variant="dots" />
            </Box>
          )}
          {answerError && (
            <Box>
              <Text>Error: {answerError.message}</Text>
            </Box>
          )}
          <Box h={40} />
        </ScrollArea>
      </Box>
    </Box>
  );
};

const QuestionDetail = ({ question }: { question: QuestionDto }) => {
  return (
    <Box>
      <Box>
        <Text>{question.userContent}</Text>
      </Box>
      <Box>
        <Text>{question.assistantReason}</Text>
        <Text>{question.assistantContent}</Text>
      </Box>
    </Box>
  );
};
