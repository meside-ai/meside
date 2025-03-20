import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let drizzleDb: NodePgDatabase | null = null;

export const getDrizzle = () => {
  if (!drizzleDb) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    drizzleDb = drizzle({
      client: pool,
    });
  }
  return drizzleDb;
};
