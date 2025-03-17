import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { QuestionEntity } from "@/db/schema/question";
import { sqlQuestionPayloadSchema } from "@/questions";
import { retrieveCatalogs } from "../retrievers/retrieve-catalogs";
import { retrieveWarehouseAssistant } from "../retrievers/retrieve-warehouse-assistant";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export class SqlWorkflow extends BaseWorkflow implements Workflow {
  async stream({
    question,
  }: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>> {
    if (question.payload.type !== "sql") {
      throw new Error("question payload is not sql");
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
      "1. only generate query sql, not include modify table, column, etc.",
      catalogPrompt,
      "# Question:",
      userQuestion,
    ].join("\n");

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      prompt,
      schema: sqlQuestionPayloadSchema.pick({
        sql: true,
      }),
      schemaName: "sql",
      schemaDescription: "get sql query",
    });

    const stream = this.createStream(aiStream, question);

    return stream;
  }
}
