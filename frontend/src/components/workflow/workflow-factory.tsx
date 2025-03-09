import { useMemo } from "react";
import { EchartsWorkflow } from "./echarts/echarts-workflow";
import { RelationWorkflow } from "./relation/relation-workflow";
import { SqlWorkflow } from "./sql/sql-workflow";
import type { WorkflowProps } from "./workflow-types";

export const WorkflowFactory = (props: WorkflowProps) => {
  const workflow = useMemo(() => {
    switch (props.question.payload.type) {
      case "sql":
        return <SqlWorkflow {...props} />;
      case "echarts":
        return <EchartsWorkflow {...props} />;
      case "relation":
        return <RelationWorkflow {...props} />;
      default:
        return null;
    }
  }, [props]);

  return workflow;
};
