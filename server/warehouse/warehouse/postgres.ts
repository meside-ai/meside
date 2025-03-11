import { getLogger } from "@/logger";
import { cuid } from "@/utils/cuid";
import pg from "pg";
import { z } from "zod";
import type { WarehouseQueryColumn, WarehouseQueryRow } from "../type";
import type {
  ConnectionConfig,
  Warehouse,
  WarehouseFactoryCatalog,
  WarehouseFactoryRelation,
} from "../warehouse.interface";

export class PostgresWarehouse implements Warehouse {
  private logger = getLogger(PostgresWarehouse.name);

  async getCatalogs(
    connection: ConnectionConfig,
  ): Promise<WarehouseFactoryCatalog[]> {
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

      const res = await client.query(`
        SELECT
            c.table_schema AS "schemaName",
            c.table_name AS "tableName",
            c.column_name AS "columnName",
            c.data_type AS "columnType",
            COALESCE(pd.description, '') AS "description"
        FROM
            information_schema.columns c
        LEFT JOIN
            pg_catalog.pg_statio_all_tables st
            ON c.table_schema = st.schemaname AND c.table_name = st.relname
        LEFT JOIN
            pg_catalog.pg_description pd
            ON pd.objoid = st.relid AND pd.objsubid = c.ordinal_position
        WHERE
            c.table_catalog = current_database()
            AND c.table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY
            c.table_name, c.ordinal_position;
      `);

      return res.rows.map((row) => ({
        schemaName: row.schemaName,
        tableName: row.tableName,
        columnName: row.columnName,
        columnType: row.columnType,
        description: row.description ?? undefined,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await client.end();
    }
  }

  async getRelations(
    connection: ConnectionConfig,
  ): Promise<WarehouseFactoryRelation[]> {
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

      const res = await client.query(`
        SELECT
            tc.table_schema AS "schemaName",
            tc.table_name AS "tableName",
            kcu.column_name AS "columnName",
            ccu.table_schema AS "foreignSchemaName",
            ccu.table_name AS "foreignTableName",
            ccu.column_name AS "foreignColumnName"
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
      `);

      return res.rows.map((row) => ({
        schemaName: row.schemaName,
        tableName: row.tableName,
        columnName: row.columnName,
        foreignSchemaName: row.foreignSchemaName,
        foreignTableName: row.foreignTableName,
        foreignColumnName: row.foreignColumnName,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await client.end();
    }
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

    let res: pg.QueryResult<any>;

    try {
      await client.connect();
      res = await client.query(sql);
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await client.end();
    }

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
          format: z.string().transform(mapFieldType),
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

  async getColumnSample(
    connection: ConnectionConfig,
    schemaName: string,
    tableName: string,
    columnName: string,
    limit = 3,
  ): Promise<WarehouseQueryRow[]> {
    const dbResult = await this.query(
      connection,
      `
      SELECT "${columnName}" AS sample
      FROM "${schemaName}"."${tableName}"
      WHERE "${columnName}" IS NOT NULL
      LIMIT ${limit}
      `,
    );

    return dbResult.rows;
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
      this.logger.error(error);
      return false;
    } finally {
      await client.end();
    }
  }
}

export enum PostgresTypes {
  INTEGER = "integer",
  INT = "int",
  INT2 = "int2",
  INT4 = "int4",
  INT8 = "int8",
  MONEY = "money",
  SMALLSERIAL = "smallserial",
  SERIAL = "serial",
  SERIAL2 = "serial2",
  SERIAL4 = "serial4",
  SERIAL8 = "serial8",
  BIGSERIAL = "bigserial",
  BIGINT = "bigint",
  SMALLINT = "smallint",
  BOOLEAN = "boolean",
  BOOL = "bool",
  DATE = "date",
  DOUBLE_PRECISION = "double precision",
  FLOAT = "float",
  FLOAT4 = "float4",
  FLOAT8 = "float8",
  JSON = "json",
  JSONB = "jsonb",
  NUMERIC = "numeric",
  DECIMAL = "decimal",
  REAL = "real",
  CHAR = "char",
  CHARACTER = "character",
  NCHAR = "nchar",
  BPCHAR = "bpchar",
  VARCHAR = "varchar",
  CHARACTER_VARYING = "character varying",
  NVARCHAR = "nvarchar",
  TEXT = "text",
  TIME = "time",
  TIME_TZ = "timetz",
  TIME_WITHOUT_TIME_ZONE = "time without time zone",
  TIMESTAMP = "timestamp",
  TIMESTAMP_TZ = "timestamptz",
  TIMESTAMP_WITHOUT_TIME_ZONE = "timestamp without time zone",
}

const mapFieldType = (type: string): WarehouseQueryColumn["columnType"] => {
  switch (type) {
    case PostgresTypes.DECIMAL:
    case PostgresTypes.NUMERIC:
    case PostgresTypes.INTEGER:
    case PostgresTypes.MONEY:
    case PostgresTypes.SMALLSERIAL:
    case PostgresTypes.SERIAL:
    case PostgresTypes.SERIAL2:
    case PostgresTypes.SERIAL4:
    case PostgresTypes.SERIAL8:
    case PostgresTypes.BIGSERIAL:
    case PostgresTypes.INT2:
    case PostgresTypes.INT4:
    case PostgresTypes.INT8:
    case PostgresTypes.BIGINT:
    case PostgresTypes.SMALLINT:
    case PostgresTypes.FLOAT:
    case PostgresTypes.FLOAT4:
    case PostgresTypes.FLOAT8:
    case PostgresTypes.DOUBLE_PRECISION:
    case PostgresTypes.REAL:
      return "number";
    case PostgresTypes.DATE:
      return "date";
    case PostgresTypes.TIME:
    case PostgresTypes.TIME_TZ:
    case PostgresTypes.TIMESTAMP:
    case PostgresTypes.TIMESTAMP_TZ:
    case PostgresTypes.TIME_WITHOUT_TIME_ZONE:
    case PostgresTypes.TIMESTAMP_WITHOUT_TIME_ZONE:
      return "timestamp";
    case PostgresTypes.BOOLEAN:
    case PostgresTypes.BOOL:
      return "boolean";
    default:
      return "string";
  }
};
