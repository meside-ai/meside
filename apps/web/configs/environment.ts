import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  SERVER_DOMAIN: z.string(),
  WAREHOUSE_DOMAIN: z.string(),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  process.exit(1);
}

export const environment = data;
