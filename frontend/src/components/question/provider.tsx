import type { QuestionDto } from "@meside/api/question.schema";
import { useState } from "react";
import { QuestionContext } from "./context";

export const QuestionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [questionCache, setQuestionCache] = useState<QuestionDto | null>(null);

  return (
    <QuestionContext.Provider
      value={{
        questionId,
        setQuestionId,
        questionCache,
        setQuestionCache,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
