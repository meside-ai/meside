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
          if (done && !object) {
            queryClient.invalidateQueries(getQuestionList({}));
            return;
          }
        }
      );
    });

    return () => {
      questionNameEvent.removeListener(unsubscribe);
    };
  }, [queryClient, stream]);

  return null;
};
