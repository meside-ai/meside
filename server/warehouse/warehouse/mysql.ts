import { getLogger } from "@/logger";
import { cuid } from "@/utils/cuid";
import mysql from "mysql2/promise";
import { z } from "zod";
import type { WarehouseQueryColumn, WarehouseQueryRow } from "../type";
import type {
  ConnectionConfig,
  Warehouse,
  WarehouseFactoryCatalog,
  WarehouseFactoryRelation,
} from "../warehouse.interface";

export class MysqlWarehouse implements Warehouse {
  private logger = getLogger(MysqlWarehouse.name);

  async getCatalogs(
    connection: ConnectionConfig,
  ): Promise<WarehouseFactoryCatalog[]> {
    const conn = await mysql.createConnection({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });

    try {
      const [rows] = await conn.execute(`
        SELECT
            TABLE_SCHEMA AS schemaName,
            TABLE_NAME AS tableName,
            COLUMN_NAME AS columnName,
            DATA_TYPE AS columnType,
            COLUMN_COMMENT AS description
        FROM
            INFORMATION_SCHEMA.COLUMNS
        WHERE
            TABLE_SCHEMA NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
        ORDER BY
            TABLE_NAME, ORDINAL_POSITION
      `);

      return (rows as any[]).map((row) => ({
        schemaName: row.schemaName,
        tableName: row.tableName,
        columnName: row.columnName,
        columnType: row.columnType,
        description: row.description || undefined,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await conn.end();
    }
  }

  async getRelations(
    connection: ConnectionConfig,
  ): Promise<WarehouseFactoryRelation[]> {
    const conn = await mysql.createConnection({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });

    try {
      const [rows] = await conn.execute(`
        SELECT
            TABLE_SCHEMA AS schemaName,
            TABLE_NAME AS tableName,
            COLUMN_NAME AS columnName,
            REFERENCED_TABLE_SCHEMA AS foreignSchemaName,
            REFERENCED_TABLE_NAME AS foreignTableName,
            REFERENCED_COLUMN_NAME AS foreignColumnName
        FROM
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE
            REFERENCED_TABLE_NAME IS NOT NULL
            AND TABLE_SCHEMA NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
      `);

      return (rows as any[]).map((row) => ({
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
      await conn.end();
    }
  }

  async query(
    connection: ConnectionConfig,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }> {
    const conn = await mysql.createConnection({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });

    let result: any;

    try {
      const [rows, fields] = await conn.execute(sql);
      result = { rows, fields };
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await conn.end();
    }

    const resSchema = z.object({
      rows: z.array(z.record(z.string(), z.any())),
      fields: z.array(
        z.object({
          name: z.string(),
          type: z.number(),
          flags: z.number(),
          db: z.string(),
          catalog: z.string(),
          schema: z.string(),
          table: z.string(),
          orgTable: z.string(),
          characterSet: z.number(),
          columnLength: z.number(),
          columnType: z.number(),
          decimals: z.number(),
        }),
      ),
    });

    const output = resSchema.parse(result);

    const fieldsMapped = output.fields.map((field) => ({
      tableName: cuid(),
      columnName: field.name,
      columnType: mapFieldType(field.columnType),
      description: "",
    }));

    return {
      rows: output.rows as WarehouseQueryRow[],
      fields: fieldsMapped,
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
      SELECT \`${columnName}\` AS sample
      FROM \`${schemaName}\`.\`${tableName}\`
      WHERE \`${columnName}\` IS NOT NULL
      LIMIT ${limit}
      `,
    );

    return dbResult.rows;
  }

  async testConnection(connection: ConnectionConfig): Promise<boolean> {
    try {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: connection.port,
        database: connection.database,
        user: connection.username,
        password: connection.password,
      });
      await conn.ping();
      await conn.end();
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}

enum MysqlTypes {
  TINYINT = 1,
  SMALLINT = 2,
  MEDIUMINT = 9,
  INT = 3,
  BIGINT = 8,
  FLOAT = 4,
  DOUBLE = 5,
  DECIMAL = 246,
  DATE = 10,
  DATETIME = 12,
  TIMESTAMP = 7,
  TIME = 11,
  YEAR = 13,
  CHAR = 254,
  VARCHAR = 253,
  TEXT = 252,
  ENUM = 247,
  SET = 248,
  BLOB = 251,
  JSON = 245,
  BOOLEAN = 16,
}

const mapFieldType = (typeId: number): WarehouseQueryColumn["columnType"] => {
  switch (typeId) {
    case MysqlTypes.TINYINT:
    case MysqlTypes.SMALLINT:
    case MysqlTypes.MEDIUMINT:
    case MysqlTypes.INT:
    case MysqlTypes.BIGINT:
    case MysqlTypes.FLOAT:
    case MysqlTypes.DOUBLE:
    case MysqlTypes.DECIMAL:
      return "number";
    case MysqlTypes.DATE:
      return "date";
    case MysqlTypes.DATETIME:
    case MysqlTypes.TIMESTAMP:
    case MysqlTypes.TIME:
    case MysqlTypes.YEAR:
      return "timestamp";
    case MysqlTypes.BOOLEAN:
      return "boolean";
    default:
      return "string";
  }
};
