import { getLogger } from "@/logger";
import { cuid } from "@/utils/cuid";
import { BigQuery } from "@google-cloud/bigquery";
import type { WarehouseQueryColumn, WarehouseQueryRow } from "../type";
import type {
  ConnectionConfig,
  Warehouse,
  WarehouseFactoryCatalog,
  WarehouseFactoryRelation,
} from "../warehouse.interface";

export class BigqueryWarehouse implements Warehouse {
  private logger = getLogger();

  async getCatalogs(
    connection: ConnectionConfig,
  ): Promise<WarehouseFactoryCatalog[]> {
    const projectId = connection.database;
    const bigquery = new BigQuery({ projectId });

    const [datasets] = await bigquery.getDatasets();

    const allColumns: WarehouseFactoryCatalog[] = [];

    for (const dataset of datasets) {
      const datasetId = dataset.id;

      if (!datasetId) {
        continue;
      }

      try {
        // Query INFORMATION_SCHEMA.COLUMNS for the current dataset
        const query = `
          SELECT
            table_catalog AS projectId,
            table_schema AS schemaName,
            table_name AS tableName,
            column_name AS columnName,
            data_type AS columnType,
            description
          FROM
            \`${projectId}.${datasetId}.INFORMATION_SCHEMA.COLUMNS\`
          ORDER BY
            tableName, columnName
        `;

        const options = {
          query: query,
          // location: 'US', // Set your dataset's location
        };

        const [rows] = await bigquery.query(options);

        // Add results to collection
        allColumns.push(...(rows as WarehouseFactoryCatalog[]));
      } catch (err) {
        console.error(`Error processing dataset ${datasetId}:`, err);
      }
    }

    return allColumns;
  }

  async getRelations(
    connection: ConnectionConfig,
  ): Promise<WarehouseFactoryRelation[]> {
    const projectId = connection.database;
    const bigquery = new BigQuery({ projectId });

    try {
      // First, get all datasets in the project
      const [datasets] = await bigquery.getDatasets();

      const allRelations: WarehouseFactoryRelation[] = [];

      // Iterate through each dataset to query its INFORMATION_SCHEMA
      for (const dataset of datasets) {
        const datasetId = dataset.id;

        if (!datasetId) {
          continue;
        }

        try {
          // Query INFORMATION_SCHEMA.KEY_COLUMN_USAGE for the current dataset
          const query = `
            SELECT
              k.table_schema AS "schemaName",
              k.table_name AS "tableName",
              k.column_name AS "columnName",
              k.referenced_table_schema AS "foreignSchemaName",
              k.referenced_table_name AS "foreignTableName",
              k.referenced_column_name AS "foreignColumnName"
            FROM
              \`${projectId}.${datasetId}.INFORMATION_SCHEMA.KEY_COLUMN_USAGE\` k
            WHERE
              k.referenced_table_name IS NOT NULL
          `;

          const options = {
            query: query,
          };

          const [rows] = await bigquery.query(options);

          // Add results to collection
          allRelations.push(
            ...rows.map((row: any) => ({
              schemaName: row.schemaName,
              tableName: row.tableName,
              columnName: row.columnName,
              foreignSchemaName: row.foreignSchemaName,
              foreignTableName: row.foreignTableName,
              foreignColumnName: row.foreignColumnName,
            })),
          );
        } catch (err) {
          this.logger.error(
            `Error processing dataset ${datasetId} for relations:`,
            err,
          );
        }
      }

      return allRelations;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async query(
    connection: ConnectionConfig,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }> {
    const projectId = connection.database;
    const bigquery = new BigQuery({ projectId });

    try {
      // Execute the query
      const [rows] = await bigquery.query({
        query: sql,
        // Use legacy SQL false by default
        useLegacySql: false,
      });

      // Get schema information from the query result
      const [job] = await bigquery.createQueryJob({
        query: sql,
        useLegacySql: false,
        dryRun: true,
      });

      const schema = job.metadata.statistics.query.schema;

      // Map BigQuery schema fields to our expected format
      const fields: WarehouseQueryColumn[] =
        schema?.fields?.map((field: any) => ({
          tableName: cuid(),
          columnName: field.name,
          columnType: mapFieldType(field.type),
          description: field.description || "",
        })) || [];

      return {
        rows,
        fields,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async testConnection(connection: ConnectionConfig): Promise<boolean> {
    const projectId = connection.database;
    try {
      // Create a BigQuery client with the provided project ID
      const bigquery = new BigQuery({ projectId });

      // Test the connection by running a simple query
      await bigquery.query({
        query: "SELECT 1",
        useLegacySql: false,
      });

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}

export enum BigqueryFieldType {
  STRING = "STRING",
  INTEGER = "INTEGER",
  BYTES = "BYTES",
  INT64 = "INT64",
  FLOAT = "FLOAT",
  FLOAT64 = "FLOAT64",
  BOOLEAN = "BOOLEAN",
  BOOL = "BOOL",
  TIMESTAMP = "TIMESTAMP",
  DATE = "DATE",
  TIME = "TIME",
  DATETIME = "DATETIME",
  GEOGRAPHY = "GEOGRAPHY",
  NUMERIC = "NUMERIC",
  BIGNUMERIC = "BIGNUMERIC",
  RECORD = "RECORD",
  STRUCT = "STRUCT",
  ARRAY = "ARRAY",
}

const mapFieldType = (type: string): WarehouseQueryColumn["columnType"] => {
  switch (type) {
    case BigqueryFieldType.INTEGER:
    case BigqueryFieldType.INT64:
    case BigqueryFieldType.FLOAT:
    case BigqueryFieldType.FLOAT64:
    case BigqueryFieldType.NUMERIC:
    case BigqueryFieldType.BIGNUMERIC:
      return "number";
    case BigqueryFieldType.DATE:
      return "date";
    case BigqueryFieldType.TIME:
    case BigqueryFieldType.TIMESTAMP:
    case BigqueryFieldType.DATETIME:
      return "timestamp";
    case BigqueryFieldType.BOOLEAN:
    case BigqueryFieldType.BOOL:
      return "boolean";
    case BigqueryFieldType.GEOGRAPHY:
      // return "geography"; // TODO: do we need to support this type?
      return "string";
    case BigqueryFieldType.ARRAY:
      // return "array"; // TODO: do we need to support this type?
      return "string";
    case BigqueryFieldType.RECORD:
    case BigqueryFieldType.STRUCT:
      // return "object"; // TODO: do we need to support this type?
      return "string";
    default:
      return "string";
  }
};
