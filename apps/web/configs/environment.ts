import { z } from "zod";

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .default("development"),
  SERVER_DOMAIN: z.string().describe("The domain of the server API"),
  ASSET_PREFIX: z
    .string()
    .optional()
    .describe(
      "The prefix for the assets, due to CDN usage, @see https://nextjs.org/docs/pages/api-reference/config/next-config-js/assetPrefix",
    ),
});

const { data, error } = environmentSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment:", error);
  throw new Error("Invalid environment configuration");
}

export const environment = data;
