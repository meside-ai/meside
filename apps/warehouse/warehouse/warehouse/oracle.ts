import oracledb from "oracledb";
import { z } from "zod";
import { getLogger } from "../../logger";
import { cuid } from "../../utils/cuid";
import type {
  Warehouse,
  WarehouseFactoryCatalog,
  WarehouseFactoryRelation,
} from "../warehouse.interface";
import type { WarehouseProvider } from "../warehouse.type";
import type {
  WarehouseQueryColumn,
  WarehouseQueryRow,
} from "../warehouse.type";

export class OracleWarehouse implements Warehouse {
  private logger = getLogger(OracleWarehouse.name);

  private async getConnection(provider: WarehouseProvider) {
    if (provider.type !== "oracle") {
      throw new Error("Invalid provider type");
    }

    return await oracledb.getConnection({
      user: provider.username,
      password: provider.password,
      connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${provider.host})(PORT=${provider.port}))(CONNECT_DATA=(SID=${provider.database})(SERVICE_NAME=${provider.database})))`,
    });
  }

  async getCatalogs(
    provider: WarehouseProvider,
  ): Promise<WarehouseFactoryCatalog[]> {
    const conn = await this.getConnection(provider);
    try {
      const res = await conn.execute(`
        SELECT
            owner AS "schemaName",
            table_name AS "tableName",
            column_name AS "columnName",
            data_type AS "columnType",
            COALESCE(comments, '') AS "description"
        FROM
            all_tab_columns
        LEFT JOIN
            all_col_comments
            USING (owner, table_name, column_name)
        WHERE
            owner NOT IN ('SYS', 'SYSTEM')
        AND 
            owner = '${provider.type === "oracle" ? provider.username.toUpperCase() : ""}'
        ORDER BY
            table_name, column_id
      `);
      return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        res.rows?.map((row: any) => ({
          schemaName: row[0],
          tableName: row[1],
          columnName: row[2],
          columnType: row[3],
          description: row[4] || undefined,
        })) || []
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await conn.close();
    }
  }

  async getRelations(
    provider: WarehouseProvider,
  ): Promise<WarehouseFactoryRelation[]> {
    const conn = await this.getConnection(provider);
    try {
      const res = await conn.execute(`
        SELECT
            c.owner AS "schemaName",
            c.table_name AS "tableName",
            cc.column_name AS "columnName",
            r.owner AS "foreignSchemaName",
            r.table_name AS "foreignTableName",
            rc.column_name AS "foreignColumnName"
        FROM
            all_constraints c
        JOIN
            all_cons_columns cc
            ON c.constraint_name = cc.constraint_name
            AND c.owner = cc.owner
        JOIN
            all_constraints r
            ON c.r_constraint_name = r.constraint_name
        JOIN
            all_cons_columns rc
            ON r.constraint_name = rc.constraint_name
        WHERE
            c.constraint_type = 'R'
      `);

      return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        res.rows?.map((row: any) => ({
          schemaName: row[0],
          tableName: row[1],
          columnName: row[2],
          foreignSchemaName: row[3],
          foreignTableName: row[4],
          foreignColumnName: row[5],
        })) || []
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await conn.close();
    }
  }

  async query(
    provider: WarehouseProvider,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }> {
    const conn = await this.getConnection(provider);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let res: oracledb.Result<any>;

    try {
      res = await conn.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await conn.close();
    }

    const resSchema = z.object({
      rows: z.array(z.record(z.string(), z.any())),
      metaData: z.array(
        z.object({
          name: z.string(),
          dbTypeName: z.string(),
        }),
      ),
    });

    const output = resSchema.parse(res);

    const fields = output.metaData.map((field) => ({
      tableName: cuid(),
      columnName: field.name,
      columnType: mapOracleFieldType(field.dbTypeName),
      description: "",
    }));

    return {
      rows: output.rows,
      fields,
    };
  }

  async getColumnSample(
    provider: WarehouseProvider,
    schemaName: string,
    tableName: string,
    columnName: string,
    limit = 3,
  ): Promise<WarehouseQueryRow[]> {
    const dbResult = await this.query(
      provider,
      `
      SELECT ${columnName} AS sample
      FROM ${schemaName}.${tableName}
      WHERE ${columnName} IS NOT NULL
      FETCH FIRST ${limit} ROWS ONLY
      `,
    );

    return dbResult.rows;
  }

  async testConnection(provider: WarehouseProvider): Promise<boolean> {
    try {
      const conn = await this.getConnection(provider);
      await conn.close();
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}

export enum OracleTypes {
  NUMBER = "NUMBER",
  VARCHAR2 = "VARCHAR2",
  DATE = "DATE",
  TIMESTAMP = "TIMESTAMP",
  CHAR = "CHAR",
  NCHAR = "NCHAR",
  NVARCHAR2 = "NVARCHAR2",
  CLOB = "CLOB",
  BLOB = "BLOB",
  RAW = "RAW",
  LONG = "LONG",
  LONG_RAW = "LONG RAW",
}

const mapOracleFieldType = (
  typeName: string,
): WarehouseQueryColumn["columnType"] => {
  const UppercaseTypeName = typeName.toUpperCase();

  if (UppercaseTypeName.startsWith("TIMESTAMP")) {
    return "timestamp";
  }

  switch (UppercaseTypeName) {
    case OracleTypes.NUMBER:
      return "number";
    case OracleTypes.DATE:
    case OracleTypes.TIMESTAMP:
      return "timestamp";
    case OracleTypes.CHAR:
    case OracleTypes.NCHAR:
    case OracleTypes.VARCHAR2:
    case OracleTypes.NVARCHAR2:
    case OracleTypes.CLOB:
    case OracleTypes.BLOB:
    case OracleTypes.RAW:
    case OracleTypes.LONG:
    case OracleTypes.LONG_RAW:
      return "string";
    default:
      return "string";
  }
};
