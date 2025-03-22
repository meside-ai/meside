import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  DATABASE_URL: z.string(),
  // SEEDING
  SEED_WAREHOUSE_HOST: z.string().optional(),
  SEED_WAREHOUSE_PORT: z
    .string()
    .optional()
    .transform((val) => Number.parseInt(val ?? "25435")),
  SEED_WAREHOUSE_DATABASE: z.string().optional(),
  SEED_WAREHOUSE_USERNAME: z.string().optional(),
  SEED_WAREHOUSE_PASSWORD: z.string().optional(),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  process.exit(1);
}

export const environment = data;
