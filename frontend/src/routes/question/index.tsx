import { Question } from "@/components/question";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const QuestionSearchSchema = z.object({
  questionId: z.string().optional(),
  quotedQuestionId: z.string().optional(),
});

export const Route = createFileRoute("/question/")({
  validateSearch: (search) => QuestionSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return <Question />;
}
