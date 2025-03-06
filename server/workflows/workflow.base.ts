import { getStructureContent } from "@/agents/agents";
import { convertMessageRole } from "@/agents/utils/utils";
import type { AIStructureOutput } from "@/ai/ai-structure";
import type { MessageEntity } from "@/db/schema/message";
import { cuid } from "@/utils/cuid";
import type { Workflow } from "./workflow.interface";

export class BaseWorkflow implements Workflow {
  async stream(body: {
    messages: MessageEntity[];
  }): Promise<ReadableStream<MessageEntity>> {
    throw new Error("Not implemented");
  }

  async generate(body: {
    messages: MessageEntity[];
  }): Promise<MessageEntity> {
    const aiStream = await this.stream(body);

    const reader = aiStream.getReader();
    let initial: MessageEntity | null = null;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (initial === null) {
          initial = value;
        } else {
          Object.assign(initial, value);
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (initial === null) {
      throw new Error("Initial message not found");
    }

    return initial;
  }

  protected convertMessageEntitiesToPrompt = async (
    messages: MessageEntity[],
  ): Promise<
    {
      role: "system" | "user" | "assistant";
      content: string;
    }[]
  > => {
    return await Promise.all(
      messages.map(async (message) => {
        const getContent = getStructureContent(message);
        const data = await getContent({ message });
        return {
          role: convertMessageRole(message.messageRole),
          content: data.content,
        };
      }),
    );
  };

  protected async createResult<T extends MessageEntity>(
    aiStream: ReadableStream<AIStructureOutput>,
    immutableInitial: T,
  ): Promise<T> {
    const reader = aiStream.getReader();
    const initial: T = JSON.parse(JSON.stringify(immutableInitial));
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        Object.assign(initial, {
          reason: value.reason,
          text: value.text,
        });
        Object.assign(
          initial.structure,
          value.structure ? value.structure : {},
        );
      }
    } finally {
      reader.releaseLock();
    }

    return initial;
  }

  protected createStream<T extends MessageEntity>(
    aiStream: ReadableStream<AIStructureOutput>,
    immutableInitial: T,
  ): ReadableStream<T> {
    return new ReadableStream<T>({
      async start(controller) {
        const reader = aiStream.getReader();
        const initial: T = JSON.parse(JSON.stringify(immutableInitial));
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            Object.assign(initial, {
              reason: value.reason,
              text: value.text,
            });
            Object.assign(
              initial.structure,
              value.structure ? value.structure : {},
            );
            controller.enqueue(initial);
          }
        } finally {
          reader.releaseLock();
        }
      },
    });
  }

  protected createInitialAssistantMessage<T extends MessageEntity>(
    systemMessage: MessageEntity,
    systemMessageStructure: T["structure"],
  ): T {
    const initial = {
      messageId: cuid(),
      threadId: systemMessage.threadId,
      ownerId: systemMessage.ownerId,
      orgId: systemMessage.orgId,
      messageRole: "ASSISTANT",
      reason: "",
      text: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      structure: systemMessageStructure,
    } as T;

    return initial;
  }
}
