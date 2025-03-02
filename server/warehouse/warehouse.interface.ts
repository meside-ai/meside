import type { WarehouseQueryColumn, WarehouseQueryRow } from "./type";

export type ConnectionConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export type WarehouseFactoryColumn = {
  tableName: string;
  columnName: string;
  columnType: string;
};

export interface Warehouse {
  getColumns: (
    connection: ConnectionConfig,
  ) => Promise<WarehouseFactoryColumn[]>;
  query: (
    connection: ConnectionConfig,
    sql: string,
  ) => Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }>;
  testConnection: (connection: ConnectionConfig) => Promise<boolean>;
}
