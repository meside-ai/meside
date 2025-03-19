import { getLogger } from "@/logger";
import { cuid } from "@/utils/cuid";
import sql from "mssql";
import { z } from "zod";
import type { WarehouseQueryColumn, WarehouseQueryRow } from "../type";
import type {
    ConnectionConfig,
    Warehouse,
    WarehouseFactoryCatalog,
    WarehouseFactoryRelation,
} from "../warehouse.interface";

export class SqlServerWarehouse implements Warehouse {
    private logger = getLogger(SqlServerWarehouse.name);

    private getConfig(connection: ConnectionConfig) {
        return {
            server: connection.host,
            port: connection.port,
            database: connection.database,
            user: connection.username,
            password: connection.password,
            options: {
                encrypt: false,
                trustServerCertificate: false
            }
        };
    }

    async getCatalogs(connection: ConnectionConfig): Promise<WarehouseFactoryCatalog[]> {
        const pool = new sql.ConnectionPool(this.getConfig(connection));

        try {
            await pool.connect();
            const result = await pool.request().query(`
        SELECT 
          s.name AS schemaName,
          t.name AS tableName,
          c.name AS columnName,
          ty.name AS columnType,
          ep.value AS description
        FROM sys.tables t
        JOIN sys.schemas s ON t.schema_id = s.schema_id
        JOIN sys.columns c ON t.object_id = c.object_id
        JOIN sys.types ty ON c.user_type_id = ty.user_type_id
        LEFT JOIN sys.extended_properties ep 
          ON ep.major_id = c.object_id 
          AND ep.minor_id = c.column_id 
          AND ep.name = 'MS_Description'
        WHERE s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
        ORDER BY t.name, c.column_id
      `);

            return result.recordset.map(row => ({
                schemaName: row.schemaName,
                tableName: row.tableName,
                columnName: row.columnName,
                columnType: row.columnType,
                description: row.description || undefined
            }));
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            await pool.close();
        }
    }

    async getRelations(connection: ConnectionConfig): Promise<WarehouseFactoryRelation[]> {
        const pool = new sql.ConnectionPool(this.getConfig(connection));

        try {
            await pool.connect();
            const result = await pool.request().query(`
        SELECT
          s.name AS schemaName,
          t.name AS tableName,
          col.name AS columnName,
          fs.name AS foreignSchemaName,
          ft.name AS foreignTableName,
          fcol.name AS foreignColumnName
        FROM sys.foreign_key_columns fkc
        JOIN sys.tables t ON fkc.parent_object_id = t.object_id
        JOIN sys.tables ft ON fkc.referenced_object_id = ft.object_id
        JOIN sys.schemas s ON t.schema_id = s.schema_id
        JOIN sys.schemas fs ON ft.schema_id = fs.schema_id
        JOIN sys.columns col ON fkc.parent_object_id = col.object_id AND fkc.parent_column_id = col.column_id
        JOIN sys.columns fcol ON fkc.referenced_object_id = fcol.object_id AND fkc.referenced_column_id = fcol.column_id
      `);

            return result.recordset.map(row => ({
                schemaName: row.schemaName,
                tableName: row.tableName,
                columnName: row.columnName,
                foreignSchemaName: row.foreignSchemaName,
                foreignTableName: row.foreignTableName,
                foreignColumnName: row.foreignColumnName
            }));
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            await pool.close();
        }
    }

    async query(
        connection: ConnectionConfig,
        sqlQuery: string
    ): Promise<{
        rows: WarehouseQueryRow[];
        fields: WarehouseQueryColumn[];
    }> {
        const pool = new sql.ConnectionPool(this.getConfig(connection));
        let result: sql.IResult<any>;

        try {
            await pool.connect();
            result = await pool.request().query(sqlQuery);
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            await pool.close();
        }

        const resSchema = z.object({
            recordset: z.array(z.record(z.string(), z.any())),
            columns: z.record(z.string(), z.object({
                index: z.number(),
                name: z.string(),
                length: z.number(),
                type: z.any()
            }))
        });

        const output = resSchema.parse(result);

        const fields = Object.values(output.columns).map(col => ({
            tableName: cuid(),
            columnName: col.name,
            columnType: mapSqlServerType(col.type),
            description: ""
        }));

        return {
            rows: output.recordset,
            fields
        };
    }

    async getColumnSample(
        connection: ConnectionConfig,
        schemaName: string,
        tableName: string,
        columnName: string,
        limit = 3
    ): Promise<WarehouseQueryRow[]> {
        const dbResult = await this.query(
            connection,
            `
      SELECT TOP ${limit} [${columnName}] AS sample
      FROM [${schemaName}].[${tableName}]
      WHERE [${columnName}] IS NOT NULL
      `
        );

        return dbResult.rows;
    }

    async testConnection(connection: ConnectionConfig): Promise<boolean> {
        console.log(connection)
        const pool = new sql.ConnectionPool(this.getConfig(connection));
        try {
            await pool.connect();
            await pool.close();
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        } finally {
            await pool.close();
        }
    }
}

const mapSqlServerType = (type: any): WarehouseQueryColumn["columnType"] => {
    const typeName = type.name.toLowerCase();
    switch (typeName) {
        case "int":
        case "bigint":
        case "smallint":
        case "tinyint":
        case "decimal":
        case "numeric":
        case "money":
        case "float":
        case "real":
            return "number";
        case "date":
            return "date";
        case "datetime":
        case "datetime2":
        case "smalldatetime":
        case "datetimeoffset":
            return "timestamp";
        case "bit":
            return "boolean";
        default:
            return "string";
    }
};