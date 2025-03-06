import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { getSystemMessage } from "@/utils/message";
import { ContentWorkflow } from "./implements/content-workflow";
import { DbWorkflow } from "./implements/db-workflow";
import { EchartsWorkflow } from "./implements/echarts-workflow";
import { NameWorkflow } from "./implements/name-workflow";
import type { Workflow } from "./workflow.interface";

export const getWorkflow = (messages: MessageEntity[]): Workflow => {
  const systemMessage = getSystemMessage(messages);

  if (!systemMessage) {
    throw new BadRequestError("System message not found");
  }

  switch (systemMessage.structure.type) {
    case "systemDb":
      return new DbWorkflow();
    case "systemContent":
      return new ContentWorkflow();
    case "systemEcharts":
      return new EchartsWorkflow();
    case "systemName":
      return new NameWorkflow();
    default:
      throw new BadRequestError("Invalid system message");
  }
};
