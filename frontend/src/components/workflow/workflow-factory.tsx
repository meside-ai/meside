import { DbWorkflow } from "./db/db-workflow";
import { EchartsWorkflow } from "./echarts/echarts-workflow";
import type { WorkflowProps } from "./workflow-types";

export const WorkflowFactory = (props: WorkflowProps) => {
  switch (props.question.payload.type) {
    case "db":
      return <DbWorkflow {...props} />;
    case "echarts":
      return <EchartsWorkflow {...props} />;
    default:
      return null;
  }
};
