import type { QuestionDto } from "@meside/api/question.schema";
import { createContext, useContext } from "react";

export type QuestionContextType = {
  questionId: string | null;
  setQuestionId: (questionId: string | null) => void;
  questionCache: QuestionDto | null;
  setQuestionCache: (question: QuestionDto | null) => void;
  quotedQuestionId: string | null;
  setQuotedQuestionId: (quotedQuestionId: string | null) => void;
};

export const QuestionContext = createContext<QuestionContextType | null>(null);

export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestionContext must be used within a QuestionContext");
  }
  return context;
};
