import * as echarts from "echarts";
import type React from "react";
import { useEffect, useRef } from "react";

interface EChartCoreProps {
  options: echarts.EChartsOption;
  style?: React.CSSProperties;
}

export const EChartCore: React.FC<EChartCoreProps> = ({ options, style }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      const resizeHandler = () => chartInstance.current?.resize();
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
        chartInstance.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    chartInstance.current?.setOption(options);
  }, [options]);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%", ...style }} />
  );
};
