import { cuid } from "@/utils/cuid";
import pg from "pg";
import { z } from "zod";
import type { WarehouseQueryColumn, WarehouseQueryRow } from "./type";
import type { ConnectionConfig, Warehouse } from "./warehouse.interface";

export class PostgresWarehouse implements Warehouse {
  async getColumns(connection: ConnectionConfig): Promise<
    {
      tableName: string;
      columnName: string;
      columnType: string;
    }[]
  > {
    const { Client } = pg;
    const client = new Client({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });
    await client.connect();

    const res = await client.query(`
      SELECT
          c.table_name AS "tableName",
          c.column_name AS "columnName",
          c.data_type AS "columnType",
          COALESCE(pd.description, '') AS "comment"
      FROM
          information_schema.columns c
      LEFT JOIN
          pg_catalog.pg_statio_all_tables st
          ON c.table_schema = st.schemaname AND c.table_name = st.relname
      LEFT JOIN
          pg_catalog.pg_description pd
          ON pd.objoid = st.relid AND pd.objsubid = c.ordinal_position
      WHERE
          c.table_catalog = current_database()  -- 当前数据库
          AND c.table_schema NOT IN ('pg_catalog', 'information_schema')  -- 排除系统表
      ORDER BY
          c.table_name, c.ordinal_position;
    `);
    await client.end();

    return res.rows.map((row) => ({
      tableName: row.tableName,
      columnName: row.columnName,
      columnType: row.columnType,
    }));
  }

  async query(
    connection: ConnectionConfig,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }> {
    const { Client } = pg;
    const client = new Client({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });
    await client.connect();

    const res = await client.query(sql);

    await client.end();

    const resSchema = z.object({
      rowCount: z.number(),
      rows: z.array(z.record(z.string(), z.any())),
      fields: z.array(
        z.object({
          name: z.string(),
          tableID: z.number(),
          columnID: z.number(),
          dataTypeID: z.number(),
          dataTypeSize: z.number(),
          dataTypeModifier: z.number(),
          format: z.string().transform((val) => {
            switch (val) {
              case "text":
                return "text";
              case "integer":
                return "integer";
              case "float":
                return "float";
              case "boolean":
                return "boolean";
              case "date":
                return "date";
              case "datetime":
                return "datetime";
            }
            return "unknown";
          }),
        }),
      ),
    });

    const output = resSchema.parse(res);

    const fields = output.fields.map((field) => ({
      tableName: cuid(),
      columnName: field.name,
      columnType: field.format,
      description: "",
    }));

    return {
      rows: output.rows,
      fields,
    };
  }

  async testConnection(connection: ConnectionConfig): Promise<boolean> {
    const { Client } = pg;
    const client = new Client({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });
    try {
      await client.connect();
      await client.end();
      return true;
    } catch (error) {
      return false;
    } finally {
      await client.end();
    }
  }
}
