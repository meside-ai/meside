import type { QuestionDto } from "@meside/api/question.schema";
import type { ReactNode } from "react";
import type { PreviewEntity } from "../preview/types";

export type InjectedQuestionLayoutProps = {
  question: QuestionDto;
  isGettingAnswer: boolean;
  answerError: Error | undefined;
  openPreview: (payload: Omit<PreviewEntity, "previewId">) => void;
  beforeUserContent?: JSX.Element | JSX.Element[] | "" | null;
  afterUserContent?: JSX.Element | JSX.Element[] | "" | null;
  afterUserEdit?: JSX.Element | JSX.Element[] | "" | null;
  beforeAssistantReason?: JSX.Element | JSX.Element[] | "" | null;
  beforeAssistantContent?: JSX.Element | JSX.Element[] | "" | null;
  afterAssistantContent?: JSX.Element | JSX.Element[] | "" | null;
  afterAssistantAction?: JSX.Element | JSX.Element[] | "" | null;
  leftAssistantAction?: JSX.Element | JSX.Element[] | "" | null;
  previewPanel?: JSX.Element | JSX.Element[] | "" | null;
};

export type WorkflowProps = {
  question: QuestionDto;
  isGettingAnswer: boolean;
  answerError: Error | undefined;
  openPreview: (payload: Omit<PreviewEntity, "previewId">) => void;
  injectedQuestionLayout: (props: InjectedQuestionLayoutProps) => ReactNode;
};
