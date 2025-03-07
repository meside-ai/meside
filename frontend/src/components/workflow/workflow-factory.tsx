import { DbWorkflow } from "./db-workflow";
import type { WorkflowProps } from "./workflow-types";

export const WorkflowFactory = (props: WorkflowProps) => {
  switch (props.question.payload.type) {
    case "db":
      return <DbWorkflow {...props} />;
    default:
      return null;
  }
};
