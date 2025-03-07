import type { QuestionEntity } from "@/db/schema/question";

export interface Workflow {
  stream(body: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>>;

  generate(body: {
    question: QuestionEntity;
  }): Promise<QuestionEntity>;
}
