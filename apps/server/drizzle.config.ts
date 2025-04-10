import { defineConfig } from "drizzle-kit";
import { environment } from "./configs/environment";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./agent/table", "./tools/warehouse/table"],
  out: "./db/migrations",
  dbCredentials: {
    url: environment.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  migrations: {
    table: "__drizzle_migrations_server",
    schema: "public",
  },
});
