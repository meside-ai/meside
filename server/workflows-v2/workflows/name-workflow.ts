import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { QuestionEntity } from "@/db/schema/question";
import { nameQuestionPayloadSchema } from "@/questions";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export class NameWorkflow extends BaseWorkflow implements Workflow {
  async stream({
    question,
  }: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>> {
    if (question.payload.type !== "name") {
      throw new Error("question payload is not name");
    }

    const userQuestion = this.convertUserContentToPrompt(question.userContent);

    const prompt = [
      "summary for the thread based on the messages",
      `min length is ${question.payload.minLength}`,
      `max length is ${question.payload.maxLength}`,
      "# user question:",
      userQuestion,
      "# assistant answer:",
      question.assistantContent,
    ].join("\n");

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      schema: nameQuestionPayloadSchema.pick({
        name: true,
      }),
      schemaName: "name",
      schemaDescription: "get name",
    });

    const stream = this.createStream(aiStream, question);

    return stream;
  }
}
