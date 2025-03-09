import { useQuery } from "@tanstack/react-query";

import { getQuestionDetail } from "@/queries/question";
import { Box } from "@mantine/core";
import { WorkflowFactory } from "../workflow/workflow-factory";

export type PreviewQuestionProps = {
  questionId: string;
};

export const PreviewQuestion = ({ questionId }: PreviewQuestionProps) => {
  const { data } = useQuery(getQuestionDetail({ questionId }));

  const question = data?.question;

  if (!question) {
    return null;
  }

  return (
    <WorkflowFactory
      question={question}
      isGettingAnswer={false}
      answerError={undefined}
      renderQuestionLayout={(props) => <Box>{props.previewPanel}</Box>}
    />
  );
};
