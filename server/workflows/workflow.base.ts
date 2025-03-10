import type { AIStructureOutput } from "@/ai/ai-structure";
import type { QuestionEntity } from "@/db/schema/question";
import {
  type EditorJSONContent,
  editorJsonToMarkdown,
} from "@/shared/editor-json-to-markdown";
import { parseJsonOrNull } from "@/shared/json";
import type { Workflow } from "./workflow.interface";

export class BaseWorkflow implements Workflow {
  async stream(body: {
    question: QuestionEntity;
    language?: string;
  }): Promise<ReadableStream<QuestionEntity>> {
    throw new Error("Not implemented");
  }

  async generate(body: {
    question: QuestionEntity;
    language?: string;
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

  protected async createResult<T extends QuestionEntity>(
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
        Object.assign(initial.payload, value.structure ? value.structure : {});
      }
    } finally {
      reader.releaseLock();
    }

    return initial;
  }

  protected createStream<T extends QuestionEntity>(
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
              assistantReason: value.reason,
              assistantContent: value.text,
            });
            Object.assign(
              initial.payload,
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
}
