import type { QuestionEntity } from "@/db/schema/question";

export interface Workflow {
  stream(body: {
    question: QuestionEntity;
    language?: string;
  }): Promise<ReadableStream<QuestionEntity>>;

  generate(body: {
    question: QuestionEntity;
    language?: string;
  }): Promise<QuestionEntity>;
}
