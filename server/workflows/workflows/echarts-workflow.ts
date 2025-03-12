import { AIStructure } from "@/ai/ai-structure";
import { environment } from "@/configs/environment";
import type { QuestionEntity } from "@/db/schema/question";
import { echartsQuestionPayloadSchema } from "@/questions";
import { BaseWorkflow } from "../workflow.base";
import type { Workflow } from "../workflow.interface";

export class EchartsWorkflow extends BaseWorkflow implements Workflow {
  async stream({
    question,
  }: {
    question: QuestionEntity;
  }): Promise<ReadableStream<QuestionEntity>> {
    if (question.payload.type !== "echarts") {
      throw new Error("question payload is not echarts");
    }

    const userQuestion = this.convertUserContentToPrompt(question.userContent);

    const sql = question.payload.sql;
    const sqlColumn = JSON.stringify(question.payload.fields);
    const warehouseDataFormat = JSON.stringify({
      rows: [
        {
          column1: "value1",
          column2: "value2",
          column3: "value3",
        },
      ],
      columns: [
        {
          columnName: "column1",
          columnType: "string",
          description: "description1",
        },
      ],
    });
    const eChartsOptionsExample = `return {
        title: {
          text: "Echarts Example",
        },
        tooltip: {},
        xAxis: {
          data: data.rows.map((row) => {
            return row.column1;
          }),
        },
        series: [
          {
            data: data.rows.map((row) => {
              return row.column2;
            }),
          },
        ],
      };`;

    const prompt = [
      "You are a echarts expert. Given sql, only return echarts options, js code, no comments.",
      "make sure the chart is lovely and beautiful.",
      "sql:",
      sql,
      "sql column:",
      sqlColumn,
      "sql data format:",
      warehouseDataFormat,
      "echartsOptions example:",
      eChartsOptionsExample,
      "echarts width is 500px, height is 300px",
      "# Question:",
      userQuestion,
    ].join("\n");

    const aiStream = new AIStructure().streamObject({
      model: environment.AI_MODEL,
      prompt,
      schema: echartsQuestionPayloadSchema.pick({
        echartsOptions: true,
      }),
      schemaName: "echartsOptions",
      schemaDescription: "get echarts options",
    });

    const stream = this.createStream(aiStream, question);

    return stream;
  }
}
