import { Route } from "@/routes/question";
import type { QuestionDto } from "@meside/shared/api/question.schema";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCallback } from "react";
import { QuestionContext } from "./context";

export const QuestionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate({ from: Route.fullPath });

  const { questionId = null } = Route.useSearch();

  const setQuestionId = useCallback(
    (questionId: string | null) => {
      navigate({
        search: (prev) =>
          prev.questionId !== questionId
            ? { questionId: questionId ?? undefined }
            : prev,
      });
    },
    [navigate],
  );

  const { quotedQuestionId = null } = Route.useSearch();

  const setQuotedQuestionId = useCallback(
    (quotedQuestionId: string | null) => {
      navigate({
        search: (prev) =>
          prev.quotedQuestionId !== quotedQuestionId
            ? { quotedQuestionId: quotedQuestionId ?? undefined }
            : prev,
      });
    },
    [navigate],
  );

  const [questionCache, setQuestionCache] = useState<QuestionDto | null>(null);

  return (
    <QuestionContext.Provider
      value={{
        questionId,
        setQuestionId,
        questionCache,
        setQuestionCache,
        quotedQuestionId,
        setQuotedQuestionId,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
