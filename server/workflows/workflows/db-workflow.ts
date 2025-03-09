import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import type { QuestionEntity } from "@/db/schema/question";
import { relationTable } from "@/db/schema/relation";
import { warehouseTable } from "@/db/schema/warehouse";
import { dbQuestionPayloadSchema } from "@/questions";
import { firstOrNotCreated } from "@/utils/toolkit";
import { eq, isNull } from "drizzle-orm";
import { and } from "drizzle-orm";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export class DbWorkflow extends BaseWorkflow implements Workflow {
  async stream({
    question,
  }: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>> {
    if (question.payload.type !== "db") {
      throw new Error("question payload is not db");
    }

    const catalogs = await getDrizzle()
      .select()
      .from(catalogTable)
      .where(
        and(
          eq(catalogTable.warehouseId, question.payload.warehouseId),
          isNull(catalogTable.deletedAt),
        ),
      );
    const relations = await getDrizzle()
      .select()
      .from(relationTable)
      .where(
        and(
          eq(relationTable.warehouseId, question.payload.warehouseId),
          isNull(relationTable.deletedAt),
        ),
      );
    const warehouse = firstOrNotCreated(
      await getDrizzle()
        .select()
        .from(warehouseTable)
        .where(eq(warehouseTable.warehouseId, question.payload.warehouseId)),
      "Warehouse not found",
    );
    const tableMarkdownHeader =
      "| Schema Name | Table Name | Column Name | Column Type | Foreign Key | Description |";
    const tableMarkdownSeparator = "| --- | --- | --- | --- | --- | --- |";
    const catalogTableMarkdown = catalogs
      .map((catalog) => {
        const description = catalog.description ?? "";
        const foreign = relations.find(
          (relation) =>
            relation.foreignSchemaName === catalog.schemaName &&
            relation.foreignTableName === catalog.tableName &&
            relation.foreignColumnName === catalog.columnName,
        );
        const foreignKey = foreign
          ? `${foreign?.foreignSchemaName}.${foreign?.foreignTableName}.${foreign?.foreignColumnName}`
          : "";
        return `| ${catalog.schemaName} | ${catalog.tableName} | ${catalog.columnName} | ${catalog.columnType} | ${foreignKey} | ${description} |`;
      })
      .join("\n");
    const warehouseType = warehouse.type;

    const userQuestion = this.convertUserContentToPrompt(question.userContent);

    const prompt = [
      `You are a ${warehouseType} expert. Given an input question, only result query sql.`,
      "Table schema:",
      tableMarkdownHeader,
      tableMarkdownSeparator,
      catalogTableMarkdown,
      "# Question:",
      userQuestion,
    ].join("\n");

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      schema: dbQuestionPayloadSchema.pick({
        sql: true,
      }),
      schemaName: "sql",
      schemaDescription: "get sql query",
    });

    const stream = this.createStream(aiStream, question);

    return stream;
  }
}
