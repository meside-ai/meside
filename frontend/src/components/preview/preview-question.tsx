import { useQuery } from "@tanstack/react-query";

import { getQuestionDetail } from "@/queries/question";
import { Box } from "@mantine/core";
import { WorkflowFactory } from "../workflow/workflow-factory";
import type { InjectedQuestionLayoutProps } from "../workflow/workflow-types";
import { usePreviewContext } from "./preview-context";

export type PreviewQuestionProps = {
  questionId: string;
};

export const PreviewQuestion = ({ questionId }: PreviewQuestionProps) => {
  const { openPreview } = usePreviewContext();
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
      openPreview={openPreview}
      injectedQuestionLayout={PreviewQuestionLayout}
    />
  );
};

const PreviewQuestionLayout = ({
  previewPanel,
}: InjectedQuestionLayoutProps) => {
  return <Box h="100%">{previewPanel}</Box>;
};
