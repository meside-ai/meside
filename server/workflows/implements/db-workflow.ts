import type {
  AssistantDbMessageStructure,
  SystemDbMessageStructure,
} from "@/agents/db";
import { assistantDbMessageStructure } from "@/agents/db";
import { getSystemMessage } from "@/agents/utils/utils";
import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export type AssistantDbMessageEntity = Omit<MessageEntity, "structure"> & {
  structure: AssistantDbMessageStructure;
};

export class DbWorkflow extends BaseWorkflow implements Workflow {
  async stream(body: {
    messages: MessageEntity[];
  }): Promise<ReadableStream<AssistantDbMessageEntity>> {
    const systemMessage = getSystemMessage(body.messages);

    if (systemMessage.structure.type !== "systemDb") {
      throw new BadRequestError("System message is not a systemDb message");
    }

    const systemMessageStructure: SystemDbMessageStructure =
      systemMessage.structure;

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      messages: await this.convertMessageEntitiesToPrompt(body.messages),
      schema: assistantDbMessageStructure.pick({
        sql: true,
      }),
      schemaName: "sql",
      schemaDescription: "get sql query",
    });

    const stream = this.createStream(
      aiStream,
      this.createInitialAssistantMessage<AssistantDbMessageEntity>(
        systemMessage,
        {
          type: "assistantDb",
          warehouseId: systemMessageStructure.warehouseId,
          sql: "",
          fields: [],
        },
      ),
    );

    return stream;
  }
}
