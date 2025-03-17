import { AIText } from "@/ai/ai-text";
import { environment } from "@/configs/environment";
import type { QuestionEntity } from "@/db/schema/question";
import { retrieveCatalogs } from "../retrievers/retrieve-catalogs";
import { retrieveWarehouseAssistant } from "../retrievers/retrieve-warehouse-assistant";
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

    const { prompt: warehouseAssistantPrompt } =
      await retrieveWarehouseAssistant({
        warehouseId: question.payload.warehouseId,
      });

    const { prompt: catalogPrompt } = await retrieveCatalogs({
      warehouseId: question.payload.warehouseId,
    });

    const userQuestion = this.convertUserContentToPrompt(question.userContent);

    const prompt = [
      warehouseAssistantPrompt,
      "# Rules:",
      "1. answer question to help user to explore or understand the warehouse.",
      catalogPrompt,
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
