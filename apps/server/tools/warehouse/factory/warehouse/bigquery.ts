import { BigQuery } from "@google-cloud/bigquery";
import type { WarehouseProvider } from "@meside/shared/api/warehouse.schema";
import type {
  WarehouseQueryColumn,
  WarehouseQueryRow,
} from "@meside/shared/api/warehouse.schema";
import { getLogger } from "@meside/shared/logger/index";
import { cuid } from "../../../../utils/cuid";
import type {
  Warehouse,
  WarehouseFactoryCatalog,
  WarehouseFactoryRelation,
} from "../warehouse.interface";

export class BigqueryWarehouse implements Warehouse {
  private logger = getLogger("bigquery");

  async getCatalogs(
    provider: WarehouseProvider,
  ): Promise<WarehouseFactoryCatalog[]> {
    if (provider.type !== "bigquery") {
      throw new Error("Invalid provider type");
    }

    const projectId = provider.projectId;
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
            c.table_catalog AS projectId,
            c.table_schema AS schemaName,
            c.table_name AS tableName,
            c.column_name AS columnName,
            c.data_type AS columnType,
            cfp.description
          FROM
            \`${projectId}.${datasetId}.INFORMATION_SCHEMA.COLUMNS\` c
          LEFT JOIN
            \`${projectId}.${datasetId}.INFORMATION_SCHEMA.COLUMN_FIELD_PATHS\` cfp
            ON cfp.table_name = c.table_name 
            AND cfp.column_name = c.column_name
          ORDER BY
            c.table_name, c.column_name
        `;

        const options = {
          query: query,
          // location: 'US', // Set your dataset's location
        };

        const [rows] = await bigquery.query(options);

        const parsedRows: WarehouseFactoryCatalog[] = rows;

        const uniqueRows = parsedRows.filter(
          (row, index, self) =>
            self.findIndex(
              (t) =>
                `${t.schemaName}.${t.tableName}.${t.columnName}` ===
                `${row.schemaName}.${row.tableName}.${row.columnName}`,
            ) === index,
        );

        // Add results to collection
        allColumns.push(...uniqueRows);
      } catch (err) {
        console.error(`Error processing dataset ${datasetId}:`, err);
      }
    }

    return allColumns;
  }

  async getRelations(
    provider: WarehouseProvider,
  ): Promise<WarehouseFactoryRelation[]> {
    if (provider.type !== "bigquery") {
      throw new Error("Invalid provider type");
    }

    const projectId = provider.projectId;
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
              ccu.table_schema AS schemaName,
              ccu.table_name as tableName,
              ccu.column_name as columnName,
              kcu.table_schema AS foreignSchemaName,
              kcu.table_name as foreignTableName,
              kcu.column_name as foreignColumnName
            FROM \`${projectId}.${datasetId}.INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE\` ccu 
            JOIN \`${projectId}.${datasetId}.INFORMATION_SCHEMA.KEY_COLUMN_USAGE\` kcu 
                ON ccu.constraint_name = kcu.constraint_name
            JOIN \`${projectId}.${datasetId}.INFORMATION_SCHEMA.TABLE_CONSTRAINTS\` tc
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
          `;

          const options = {
            query: query,
          };

          const [rows] = await bigquery.query(options);

          // Add results to collection
          allRelations.push(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    provider: WarehouseProvider,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }> {
    if (provider.type !== "bigquery") {
      throw new Error("Invalid provider type");
    }

    const projectId = provider.projectId;
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
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

  async testConnection(provider: WarehouseProvider): Promise<boolean> {
    if (provider.type !== "bigquery") {
      throw new Error("Invalid provider type");
    }

    const projectId = provider.projectId;
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

  async getColumnSample(
    provider: WarehouseProvider,
    schemaName: string,
    tableName: string,
    columnName: string,
    limit = 3,
  ): Promise<WarehouseQueryRow[]> {
    if (provider.type !== "bigquery") {
      throw new Error("Invalid provider type");
    }

    const projectId = provider.projectId;

    try {
      // In BigQuery, the format is `project.dataset.table`
      // schemaName in this context refers to the dataset
      const dbResult = await this.query(
        provider,
        `
        SELECT \`${columnName}\` AS sample
        FROM \`${projectId}.${schemaName}.${tableName}\`
        WHERE \`${columnName}\` IS NOT NULL
        LIMIT ${limit}
        `,
      );

      return dbResult.rows;
    } catch (error) {
      this.logger.error(error);
      throw error;
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
