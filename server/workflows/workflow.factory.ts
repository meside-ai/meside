import type { QuestionEntity } from "@/db/schema/question";
import { BadRequestError } from "@/utils/error";
import type { Workflow } from "./workflow.interface";
import { DbWorkflow } from "./workflows/db-workflow";
import { EchartsWorkflow } from "./workflows/echarts-workflow";
import { NameWorkflow } from "./workflows/name-workflow";

export const getWorkflowFactory = (question: QuestionEntity): Workflow => {
  switch (question.payload.type) {
    case "db":
      return new DbWorkflow();
    case "echarts":
      return new EchartsWorkflow();
    case "name":
      return new NameWorkflow();
    default:
      throw new BadRequestError("Invalid system message");
  }
};
