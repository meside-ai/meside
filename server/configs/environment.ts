import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val) : undefined)),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  AI_API_KEY: z.string(),
  AI_BASE_URL: z.string().optional(),
  AI_MODEL: z
    .enum(["gpt-4o", "o1", "deepseek-reasoner"])
    .optional()
    .default("o1"),
  AI_MODE: z
    .enum(["tool", "structuredOutput", "text"])
    .optional()
    .default("structuredOutput"),
  // SEEDING
  SEED_WAREHOUSE_HOST: z.string().optional(),
  SEED_WAREHOUSE_PORT: z
    .string()
    .optional()
    .transform((val) => Number.parseInt(val ?? "25435")),
  SEED_WAREHOUSE_DATABASE: z.string().optional(),
  SEED_WAREHOUSE_USERNAME: z.string().optional(),
  SEED_WAREHOUSE_PASSWORD: z.string().optional(),
  IDLE_TIMEOUT: z
    .string()
    .optional()
    .default("20")
    .transform((val) => Number.parseInt(val)),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  process.exit(1);
}

export const environment = data;
