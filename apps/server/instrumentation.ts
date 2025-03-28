import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { environment } from "./configs/environment";

const getSpanProcessors = (): BatchSpanProcessor[] => {
  const spanProcessors: BatchSpanProcessor[] = [];

  if (environment.OTLP_TRACE_EXPORTER_URL) {
    const otlpExporter = new OTLPTraceExporter({
      url: environment.OTLP_TRACE_EXPORTER_URL,
    });
    const otlpProcessor = new BatchSpanProcessor(otlpExporter);
    spanProcessors.push(otlpProcessor);
  }
  return spanProcessors;
};

const sdk = new NodeSDK({
  serviceName: environment.OTLP_SERVICE_NAME,
  spanProcessors: getSpanProcessors(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [new HttpInstrumentation(), getNodeAutoInstrumentations()],
});

sdk.start();
