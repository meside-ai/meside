import { AIText } from "@/ai/ai-text";
import { environment } from "@/configs/environment";
import type { QuestionEntity } from "@/db/schema/question";
import { retrieveWarehouse } from "../retrievers/warehouse-retriever";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export class RelationWorkflow extends BaseWorkflow implements Workflow {
  async stream({
    question,
  }: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>> {
    if (question.payload.type !== "relation") {
      throw new Error("question payload is not relation");
    }

    const { warehousePrompt, warehouseType } = await retrieveWarehouse({
      warehouseId: question.payload.warehouseId,
    });

    const userQuestion = this.convertUserContentToPrompt(question.userContent);

    const prompt = [
      `You are a ${warehouseType} expert. answer question to help user to explore or understand the warehouse.`,
      warehousePrompt,
      "# Question:",
      userQuestion,
    ].join("\n");

    const aiStream = new AIText().streamText({
      model: environment.AI_MODEL,
      prompt,
    });

    const stream = this.createStream(aiStream, question);

    return stream;
  }
}
