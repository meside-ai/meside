import { Suspense, lazy } from "react";
import type { EchartsProps } from "./echarts";

const Echarts = lazy(() =>
  import("./echarts").then((module) => ({ default: module.Echarts }))
);

export const EchartsLazyLoader = (props: EchartsProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Echarts {...props} />
    </Suspense>
  );
};
