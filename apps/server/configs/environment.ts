import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  DATABASE_URL: z.string(),
  PORT: z
    .string()
    .default("3003")
    .transform((val) => Number.parseInt(val)),
  IDLE_TIMEOUT: z
    .string()
    .default("30")
    .transform((val) => Number.parseInt(val)),
  JWT_SECRET: z.string().default("your-secret-key"),
  GOOGLE_CLIENT_ID: z.string().default("google-client-id"),
  OTLP_TRACE_EXPORTER_URL: z
    .string()
    .default("http://localhost:4318/v1/traces"),
  OTLP_SERVICE_NAME: z.string().default("meside-server"),
  AUTO_MIGRATE_DATABASE: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true")
    .describe("Whether to migrate the database automatically"),
  SERVER_DOMAIN: z.string().optional().default("http://localhost:3003/"),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  throw new Error("Invalid environment configuration");
}

export const environment = data;
