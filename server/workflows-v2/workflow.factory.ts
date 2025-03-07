import type { QuestionEntity } from "@/db/schema/question";
import { BadRequestError } from "@/utils/error";
import type { Workflow } from "./workflow.interface";
import { DbWorkflow } from "./workflows/db-workflow";

export const getWorkflowFactory = (question: QuestionEntity): Workflow => {
  switch (question.payload.type) {
    case "db":
      return new DbWorkflow();
    default:
      throw new BadRequestError("Invalid system message");
  }
};
