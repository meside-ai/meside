import { EchartsWorkflow } from "./echarts/echarts-workflow";
import { SqlWorkflow } from "./sql/sql-workflow";
import type { WorkflowProps } from "./workflow-types";

export const WorkflowFactory = (props: WorkflowProps) => {
  switch (props.question.payload.type) {
    case "sql":
      return <SqlWorkflow {...props} />;
    case "echarts":
      return <EchartsWorkflow {...props} />;
    default:
      return null;
  }
};
