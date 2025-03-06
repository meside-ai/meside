import {
  type AssistantEchartsMessageStructure,
  assistantEchartsMessageStructure,
} from "@/agents/echarts";
import { getSystemMessage } from "@/agents/utils/utils";
import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export type AssistantEchartsMessageEntity = Omit<MessageEntity, "structure"> & {
  structure: AssistantEchartsMessageStructure;
};

export class EchartsWorkflow extends BaseWorkflow implements Workflow {
  async stream(body: {
    messages: MessageEntity[];
  }): Promise<ReadableStream<AssistantEchartsMessageEntity>> {
    const systemMessage = getSystemMessage(body.messages);

    if (systemMessage.structure.type !== "systemEcharts") {
      throw new BadRequestError(
        "System message is not a systemEcharts message",
      );
    }

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      messages: await this.convertMessageEntitiesToPrompt(body.messages),
      schema: assistantEchartsMessageStructure.pick({
        echartsOptions: true,
      }),
      schemaName: "echarts",
      schemaDescription: "get echarts options",
    });

    const stream = this.createStream(
      aiStream,
      this.createInitialAssistantMessage<AssistantEchartsMessageEntity>(
        systemMessage,
        {
          type: "assistantEcharts",
          warehouseId: systemMessage.structure.warehouseId,
          sql: systemMessage.structure.sql,
          fields: systemMessage.structure.fields,
          echartsOptions: "",
        },
      ),
    );

    return stream;
  }
}
