import { BadRequestError } from "@/utils/error";
import type { GetContent } from "../types/content.interface";

export const getSystemEchartsMessageContent: GetContent = async ({
  message,
}) => {
  if (message.structure.type !== "systemEcharts") {
    throw new BadRequestError("System message is not a systemEcharts message");
  }

  const sql = message.structure.sql;
  const sqlColumn = JSON.stringify(message.structure.fields);
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
  const eChartsOptionsExample = `
      return {
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
      };
      `;

  const content = `You are a echarts expert. Given sql, only return echarts options, js code, no comments.
  make sure the chart is lovely and beautiful.
  sql:
  ${sql}
  sql column:
  ${sqlColumn}
  sql data format:
  ${warehouseDataFormat}
  echartsOptions example:
  ${eChartsOptionsExample}
`;

  return {
    content,
  };
};

export const getAssistantEchartsMessageContent: GetContent = async ({
  message,
}) => {
  if (message.structure.type !== "assistantEcharts") {
    throw new BadRequestError(
      "System message is not a assistantEcharts message",
    );
  }

  const { fields, echartsOptions } = message.structure;

  const content = `
  echartsOptions:
  ${echartsOptions}
  fields:
  ${JSON.stringify(fields)}
  `;

  return {
    content,
  };
};
