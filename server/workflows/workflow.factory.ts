import type { QuestionEntity } from "@/db/schema/question";
import { BadRequestError } from "@/utils/error";
import type { Workflow } from "./workflow.interface";
import { EchartsWorkflow } from "./workflows/echarts-workflow";
import { NameWorkflow } from "./workflows/name-workflow";
import { RelationWorkflow } from "./workflows/relation-workflow";
import { SqlWorkflow } from "./workflows/sql-workflow";

export const getWorkflowFactory = (question: QuestionEntity): Workflow => {
  switch (question.payload.type) {
    case "sql":
      return new SqlWorkflow();
    case "echarts":
      return new EchartsWorkflow();
    case "name":
      return new NameWorkflow();
    case "relation":
      return new RelationWorkflow();
    default:
      throw new BadRequestError("Invalid system message");
  }
};
