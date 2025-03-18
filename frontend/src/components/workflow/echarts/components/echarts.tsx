import { getQuestionDetail } from "@/queries/question";
import { getWarehouseExecute } from "@/queries/warehouse";
import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import * as echarts from "echarts";
import { useMemo } from "react";
import { EChartCore } from "./echarts-core";

export type EchartsProps = {
  questionId: string;
};

export const Echarts = ({ questionId }: EchartsProps) => {
  const questionDetailResult = useQuery(getQuestionDetail({ questionId }));

  const { data } = useQuery(
    getWarehouseExecute({
      questionId,
    }),
  );

  const options = useMemo<echarts.EChartsOption | null>(() => {
    if (!data) {
      return null;
    }
    if (!questionDetailResult.data?.question) {
      return null;
    }
    const payload = questionDetailResult.data.question.payload;
    if (payload.type !== "echarts") {
      return null;
    }
    const echartsOptions = payload.echartsOptions;

    try {
      const func = new Function("data", "echarts", echartsOptions);
      const echartsConfig = func.call(null, data, echarts);
      return echartsConfig;
    } catch (error) {
      console.info("echarts config error start <--");
      console.error(error);
      console.info("echarts config error end -->");
      return null;
    }
  }, [data, questionDetailResult.data?.question]);

  if (!options) {
    return <Text p="md">Rendering...</Text>;
  }

  return <EChartCore options={options} />;
};
