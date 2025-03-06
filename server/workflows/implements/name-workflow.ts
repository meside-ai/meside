import {
  type AssistantNameMessageStructure,
  assistantNameMessageStructure,
} from "@/agents/name";
import { getSystemMessage } from "@/agents/utils/utils";
import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export type AssistantNameMessageEntity = Omit<MessageEntity, "structure"> & {
  structure: AssistantNameMessageStructure;
};

export class NameWorkflow extends BaseWorkflow implements Workflow {
  async stream(body: {
    messages: MessageEntity[];
  }): Promise<ReadableStream<AssistantNameMessageEntity>> {
    const systemMessage = getSystemMessage(body.messages);

    if (systemMessage.structure.type !== "systemName") {
      throw new BadRequestError("System message is not a systemName message");
    }

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      messages: await this.convertMessageEntitiesToPrompt(body.messages),
      schema: assistantNameMessageStructure.pick({
        name: true,
      }),
      schemaName: "name",
      schemaDescription: "get name",
    });

    const stream = this.createStream(
      aiStream,
      this.createInitialAssistantMessage<AssistantNameMessageEntity>(
        systemMessage,
        {
          type: "assistantName",
          name: "",
          threadId: systemMessage.structure.threadId,
        },
      ),
    );

    return stream;
  }
}
