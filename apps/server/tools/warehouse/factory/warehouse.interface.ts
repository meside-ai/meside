import type { WarehouseProvider } from "@meside/shared/api/warehouse.schema";
import type {
  WarehouseQueryColumn,
  WarehouseQueryRow,
} from "@meside/shared/api/warehouse.schema";

export type WarehouseFactoryCatalog = {
  schemaName: string;
  tableName: string;
  columnName: string;
  columnType: string;
  description?: string;
};

export type WarehouseFactoryRelation = {
  schemaName: string;
  tableName: string;
  columnName: string;
  foreignSchemaName: string;
  foreignTableName: string;
  foreignColumnName: string;
};

export interface Warehouse {
  getCatalogs: (
    provider: WarehouseProvider,
  ) => Promise<WarehouseFactoryCatalog[]>;
  getRelations: (
    provider: WarehouseProvider,
  ) => Promise<WarehouseFactoryRelation[]>;
  query: (
    provider: WarehouseProvider,
    sql: string,
  ) => Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }>;
  getColumnSample: (
    provider: WarehouseProvider,
    schemaName: string,
    tableName: string,
    columnName: string,
    limit: number,
  ) => Promise<WarehouseQueryRow[]>;
  testConnection: (provider: WarehouseProvider) => Promise<boolean>;
}
