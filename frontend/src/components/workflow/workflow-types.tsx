import type { QuestionDto } from "@meside/api/question.schema";

export type RenderQuestionLayout = (props: {
  question: QuestionDto;
  isGettingAnswer: boolean;
  answerError: Error | undefined;
  beforeUserContent?: JSX.Element | JSX.Element[];
  afterUserContent?: JSX.Element | JSX.Element[];
  afterUserEdit?: JSX.Element | JSX.Element[];
  beforeAssistantReason?: JSX.Element | JSX.Element[];
  beforeAssistantContent?: JSX.Element | JSX.Element[];
  afterAssistantContent?: JSX.Element | JSX.Element[];
  afterAssistantAction?: JSX.Element | JSX.Element[];
  leftAssistantAction?: JSX.Element | JSX.Element[];
  previewPanel?: JSX.Element | JSX.Element[];
}) => JSX.Element;

export type WorkflowProps = {
  question: QuestionDto;
  isGettingAnswer: boolean;
  answerError: Error | undefined;
  renderQuestionLayout: RenderQuestionLayout;
};
