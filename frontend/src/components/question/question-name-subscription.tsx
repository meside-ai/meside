import { getQuestionList } from "@/queries/question";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { questionNameEvent } from "./question-name-event";
import { useStreamObject } from "./use-stream-object";

export const QuestionNameSubscription = () => {
  const queryClient = useQueryClient();

  const { stream } = useStreamObject();

  useEffect(() => {
    const unsubscribe = questionNameEvent.listen(async (payload) => {
      const { userContent, assistantContent } = payload;

      stream(
        {
          userContent,
          assistantContent,
          workflowType: "name",
          debounce: 500,
        },
        (object, done) => {
          if (done) {
            queryClient.invalidateQueries(getQuestionList({}));
            return;
          }
          if (!object) {
            return;
          }
          // queryClient.setQueryData(
          //   getQuestionList({}).queryKey,
          //   (prev: QuestionListResponse | undefined) => {
          //     if (!prev?.questions) {
          //       return prev;
          //     }
          //     return produce(prev, (draft) => {
          //       for (const question of draft.questions) {
          //         if (question.questionId === object.questionId) {
          //           question.shortName = object.shortName;
          //         }
          //       }
          //     });
          //   }
          // );
        }
      );
    });

    return () => {
      questionNameEvent.removeListener(unsubscribe);
    };
  }, [queryClient, stream]);

  return null;
};
