import { EchartsWorkflowStarter } from "./echarts/echarts-starter";
import { RelationStarter } from "./relation/relation-starter";
import { DbWorkflowStarter } from "./sql/sql-starter";
import type { StarterProps } from "./starter-types";

export const StarterFactory = (props: StarterProps) => {
  switch (props.workflowType) {
    case "sql":
      return <DbWorkflowStarter {...props} />;
    case "echarts":
      return <EchartsWorkflowStarter {...props} />;
    case "relation":
      return <RelationStarter {...props} />;
    default:
      return null;
  }
};
