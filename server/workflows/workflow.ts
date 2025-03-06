import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { getSystemMessage } from "@/utils/message";
import { DbWorkflow } from "./implements/db-workflow";
import type { Workflow } from "./workflow.interface";

export const getWorkflow = (messages: MessageEntity[]): Workflow => {
  const systemMessage = getSystemMessage(messages);

  if (!systemMessage) {
    throw new BadRequestError("System message not found");
  }

  if (systemMessage.structure.type === "systemDb") {
    return new DbWorkflow();
  }

  throw new BadRequestError("Invalid system message");
};
