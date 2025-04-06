import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().default("your-secret-key"),
  GOOGLE_CLIENT_ID: z.string().default("google-client-id"),
  OTLP_TRACE_EXPORTER_URL: z
    .string()
    .default("http://localhost:4318/v1/traces"),
  OTLP_SERVICE_NAME: z.string().default("meside-server"),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  throw new Error("Invalid environment configuration");
}

export const environment = data;
