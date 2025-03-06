import type { WarehouseQueryColumn, WarehouseQueryRow } from "./type";

export type ConnectionConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

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
    connection: ConnectionConfig,
  ) => Promise<WarehouseFactoryCatalog[]>;
  getRelations: (
    connection: ConnectionConfig,
  ) => Promise<WarehouseFactoryRelation[]>;
  query: (
    connection: ConnectionConfig,
    sql: string,
  ) => Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }>;
  testConnection: (connection: ConnectionConfig) => Promise<boolean>;
}
