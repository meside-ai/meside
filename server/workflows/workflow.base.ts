import type { AIStructureOutput } from "@/ai/ai-structure";
import type { QuestionEntity } from "@/db/schema/question";
import {
  type EditorJSONContent,
  editorJsonToMarkdown,
} from "@meside/shared/editor/editor-json-to-markdown";
import { parseJsonOrNull } from "@meside/shared/utils/json";
import type { Workflow } from "./workflow.interface";

export class BaseWorkflow implements Workflow {
  async stream(body: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>> {
    throw new Error("Not implemented");
  }

  async generate(body: {
    question: QuestionEntity;
  }): Promise<QuestionEntity> {
    const aiStream = await this.stream(body);

    const reader = aiStream.getReader();
    let initial: QuestionEntity | null = null;
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

  protected convertUserContentToPrompt = (userContent: string): string => {
    const json = parseJsonOrNull<EditorJSONContent>(userContent);
    if (json) {
      return editorJsonToMarkdown(json);
    }
    return userContent;
  };

  protected createStream<T extends QuestionEntity>(
    aiStream: ReadableStream<AIStructureOutput>,
    immutableInitial: T,
  ): ReadableStream<T> {
    return new ReadableStream<T>({
      async start(controller) {
        const reader = aiStream.getReader();
        const initial: T = JSON.parse(JSON.stringify(immutableInitial));
        Object.assign(initial, getAssistantStatus("pending"));
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              Object.assign(initial, getAssistantStatus("success"));
              controller.close();
              break;
            }
            Object.assign(initial, {
              assistantReason: value.reason,
              assistantContent: value.text,
            });
            Object.assign(
              initial.payload,
              value.structure ? value.structure : {},
            );
            controller.enqueue(initial);
          }
        } catch (error) {
          Object.assign(initial, getAssistantStatus("error"));
          controller.enqueue(initial);
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });
  }
}

const getAssistantStatus = (
  status: QuestionEntity["assistantStatus"],
): Pick<QuestionEntity, "assistantStatus"> => {
  return {
    assistantStatus: status,
  };
};
