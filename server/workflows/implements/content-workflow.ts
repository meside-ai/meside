import {
  type AssistantContentMessageStructure,
  assistantContentMessageStructure,
} from "@/agents/content";
import { getSystemMessage } from "@/agents/utils/utils";
import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export type AssistantContentMessageEntity = Omit<MessageEntity, "structure"> & {
  structure: AssistantContentMessageStructure;
};

export class ContentWorkflow extends BaseWorkflow implements Workflow {
  async stream(body: {
    messages: MessageEntity[];
  }): Promise<ReadableStream<AssistantContentMessageEntity>> {
    const systemMessage = getSystemMessage(body.messages);

    if (systemMessage.structure.type !== "systemContent") {
      throw new BadRequestError(
        "System message is not a systemContent message",
      );
    }

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      messages: await this.convertMessageEntitiesToPrompt(body.messages),
      schema: assistantContentMessageStructure.pick({
        content: true,
      }),
      schemaName: "content",
      schemaDescription: "get content",
    });

    const stream = this.createStream(
      aiStream,
      this.createInitialAssistantMessage<AssistantContentMessageEntity>(
        systemMessage,
        {
          type: "assistantContent",
          content: "",
        },
      ),
    );

    return stream;
  }
}
