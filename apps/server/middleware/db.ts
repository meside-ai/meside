import { getLogger } from "@meside/shared/logger/index";
import type { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { environment } from "../configs/environment";
import { getDrizzle } from "../db/db";

declare module "hono" {
  interface ContextVariableMap {
    db: NodePgDatabase<Record<string, unknown>>;
  }
}

export const createDbMiddleware = () => {
  const logger = getLogger("dbMiddleware");
  let isMigrated = false;

  return createMiddleware(async (c: Context, next: Next) => {
    const db = getDrizzle();
    c.set("db", db);

    if (environment.AUTO_MIGRATE_DATABASE && !isMigrated) {
      try {
        logger.info("Migrating database...");
        await migrate(db, {
          migrationsFolder: "db/migrations",
        });
        logger.info("Database migrated successfully");
      } catch (error) {
        logger.error("Failed to migrate database", error);
      } finally {
        isMigrated = true;
      }
    }
    await next();
  });
};
