import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  DATABASE_URL: z.string(),
  SERVER_DOMAIN: z
    .string()
    .optional()
    .default("http://localhost:3003/")
    .describe("The domain of the server API"),
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
  throw new Error("Invalid environment configuration");
}

export const environment = data;
