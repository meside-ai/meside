import type { QuestionDto } from "@meside/shared/api/question.schema";
import type { PreviewEntity } from "../preview/types";

export type StarterProps = {
  workflowType: QuestionDto["payload"]["type"];
  quotedQuestion: QuestionDto | null;
  openPreview: (preview: Omit<PreviewEntity, "previewId">) => void;
};
