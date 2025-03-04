import { getWarehouseExecute } from "@/queries/warehouse";
import { useQuery } from "@tanstack/react-query";
import type * as echarts from "echarts";
import { useMemo } from "react";
import { EChartCore } from "./echarts-core";

export type EchartsProps = {
  messageId: string;
  warehouseId: string;
  echartsOptions: string;
};

export const Echarts = ({
  messageId,
  warehouseId,
  echartsOptions,
}: EchartsProps) => {
  const { data } = useQuery(
    getWarehouseExecute({
      warehouseId,
      messageId,
    })
  );

  const options = useMemo<echarts.EChartsOption | null>(() => {
    if (!data) {
      return null;
    }

    try {
      const func = new Function("data", echartsOptions);
      const echartsConfig = func.call(null, data);
      return echartsConfig;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [data, echartsOptions]);

  if (!options) {
    return "loading";
  }

  return <EChartCore options={options} />;
};
