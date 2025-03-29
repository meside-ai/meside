import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  DATABASE_URL: z.string(),
  OTLP_TRACE_EXPORTER_URL: z
    .string()
    .optional()
    .default("http://localhost:4318/v1/traces"),
  OTLP_SERVICE_NAME: z.string().optional().default("meside-server"),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  process.exit(1);
}

export const environment = data;
