import { getLogger } from "@meside/shared/logger/index";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { environment } from "../configs/environment";

let drizzleDb: NodePgDatabase | null = null;

const logger = getLogger("getDrizzle");

export const getDrizzle = () => {
  if (!drizzleDb) {
    logger.info("Creating drizzle client", environment.DATABASE_URL);
    const pool = new Pool({
      connectionString: environment.DATABASE_URL,
    });
    drizzleDb = drizzle({
      client: pool,
    });
  }
  return drizzleDb;
};
