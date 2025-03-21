import { and, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../../../db/db";
import { catalogTable } from "../../../../db/schema/catalog";
import { labelTable } from "../../../../db/schema/label";
import { queryTable } from "../../../../db/schema/query";
import { relationTable } from "../../../../db/schema/relation";
import {
  type WarehouseEntity,
  warehouseTable,
} from "../../../../db/schema/warehouse";
import { cuid } from "../../../../utils/cuid";
import { firstOrNotFound } from "../../../../utils/toolkit";
import type {
  WarehouseQueryColumn,
  WarehouseQueryRow,
} from "../../../../warehouse/type";
import { WarehouseFactory } from "../../../../warehouse/warehouse";
import type { ConnectionConfig } from "../../../../warehouse/warehouse.interface";

class WarehouseService {
  private warehouseFactory = new WarehouseFactory();

  /**
   * Get all warehouses
   */
  async getWarehouses() {
    try {
      const warehouses = await getDrizzle()
        .select({
          warehouseId: warehouseTable.warehouseId,
          name: warehouseTable.name,
          type: warehouseTable.type,
        })
        .from(warehouseTable);

      return warehouses;
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      throw new Error("Failed to fetch warehouses");
    }
  }

  /**
   * Get warehouse by ID
   */
  async getWarehouse(warehouseName: string): Promise<WarehouseEntity> {
    const warehouses = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.name, warehouseName))
      .limit(1);

    const warehouse = firstOrNotFound(
      warehouses,
      `Warehouse with name ${warehouseName} not found`,
    );

    return warehouse;
  }

  /**
   * Get all tables in a warehouse
   */
  async getTables(warehouseName: string) {
    try {
      const warehouse = await this.getWarehouse(warehouseName);

      const connectionConfig: ConnectionConfig = {
        host: warehouse.host,
        port: warehouse.port,
        database: warehouse.database,
        username: warehouse.username,
        password: warehouse.password,
      };

      const warehouseInstance = this.warehouseFactory.create(warehouse.type);
      const catalogs = await warehouseInstance.getCatalogs(connectionConfig);

      // Group by schema and table
      const tables = catalogs.reduce(
        (acc, catalog) => {
          const key = `${catalog.schemaName}.${catalog.tableName}`;
          if (!acc[key]) {
            acc[key] = {
              schemaName: catalog.schemaName,
              tableName: catalog.tableName,
            };
          }
          return acc;
        },
        {} as Record<string, { schemaName: string; tableName: string }>,
      );

      return Object.values(tables);
    } catch (error) {
      console.error(
        `Error fetching tables for warehouse ${warehouseName}:`,
        error,
      );
      throw new Error(`Failed to fetch tables for warehouse ${warehouseName}`);
    }
  }

  /**
   * Get columns for a specific table in a warehouse
   */
  async getColumns(warehouseName: string, schemaTableName: string) {
    const [schemaName, tableName] = schemaTableName.split(".");

    try {
      const warehouse = await this.getWarehouse(warehouseName);

      const connectionConfig: ConnectionConfig = {
        host: warehouse.host,
        port: warehouse.port,
        database: warehouse.database,
        username: warehouse.username,
        password: warehouse.password,
      };

      const warehouseInstance = this.warehouseFactory.create(warehouse.type);
      const catalogs = await warehouseInstance.getCatalogs(connectionConfig);
      const relations = await warehouseInstance.getRelations(connectionConfig);

      const labels = await getDrizzle()
        .select()
        .from(labelTable)
        .where(eq(labelTable.warehouseId, warehouse.warehouseId));

      // Filter by table name and schema (if provided)
      const columns = catalogs
        .filter((catalog) => {
          const tableMatch = catalog.tableName === tableName;
          const schemaMatch = !schemaName || catalog.schemaName === schemaName;
          return tableMatch && schemaMatch;
        })
        .map((catalog) => {
          const label = labels.find(
            (label) =>
              label.catalogFullName ===
              `${catalog.schemaName}.${catalog.tableName}.${catalog.columnName}`,
          );
          const foreign = relations.find(
            (relation) =>
              relation.schemaName === catalog.schemaName &&
              relation.tableName === catalog.tableName &&
              relation.columnName === catalog.columnName,
          );
          return {
            ...catalog,
            foreign: foreign
              ? `${foreign.foreignSchemaName}.${foreign.foreignTableName}.${foreign.foreignColumnName}`
              : null,
            description: label?.jsonLabel,
          };
        });

      return columns;
    } catch (error) {
      console.error(
        `Error fetching columns for warehouse ${warehouseName}, table ${schemaTableName}:`,
        error,
      );
      throw new Error(
        `Failed to fetch columns for warehouse ${warehouseName}, table ${schemaTableName}`,
      );
    }
  }

  /**
   * Run a SQL query on a specific warehouse
   */
  async runQuery(
    warehouseId: string,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
    queryUrl: string;
  }> {
    const warehouse = await this.getWarehouse(warehouseId);

    const connectionConfig: ConnectionConfig = {
      host: warehouse.host,
      port: warehouse.port,
      database: warehouse.database,
      username: warehouse.username,
      password: warehouse.password,
    };

    const warehouseInstance = this.warehouseFactory.create(warehouse.type);
    const result = await warehouseInstance.query(connectionConfig, sql);
    const query = await this.createQuery(warehouseId, sql, result.fields);
    const queryUrl = `/meside/warehouse/query/${query.queryId}`;

    return {
      ...result,
      queryUrl,
    };
  }

  async createQuery(
    warehouseName: string,
    sql: string,
    fields: WarehouseQueryColumn[],
  ): Promise<{ queryId: string }> {
    const warehouse = await this.getWarehouse(warehouseName);
    const query = await getDrizzle()
      .insert(queryTable)
      .values({
        queryId: cuid(),
        warehouseId: warehouse.warehouseId,
        warehouseType: warehouse.type,
        sql,
        fields,
      })
      .returning({
        queryId: queryTable.queryId,
      });

    return firstOrNotFound(query, "Failed to create query");
  }

  async getCatalogs(warehouseName: string) {
    console.log("getCatalogs", warehouseName);
    const warehouse = await this.getWarehouse(warehouseName);
    const catalogs = await getDrizzle()
      .select()
      .from(catalogTable)
      .where(
        and(
          eq(catalogTable.warehouseId, warehouse.warehouseId),
          isNull(catalogTable.deletedAt),
        ),
      );
    const relations = await getDrizzle()
      .select()
      .from(relationTable)
      .where(
        and(
          eq(relationTable.warehouseId, warehouse.warehouseId),
          isNull(relationTable.deletedAt),
        ),
      );
    const labels = await getDrizzle()
      .select()
      .from(labelTable)
      .where(eq(labelTable.warehouseId, warehouse.warehouseId));

    const tableMarkdownHeader =
      "| Schema Name | Table Name | Column Name | Column Type | Foreign Key | Description |";
    const tableMarkdownSeparator = "| --- | --- | --- | --- | --- | --- |";
    const catalogTableMarkdown = catalogs
      .map((catalog) => {
        const jsonLabel =
          labels.find((label) => label.catalogFullName === catalog.fullName)
            ?.jsonLabel ?? "";
        const description = catalog.description ?? "";
        const foreign = relations.find(
          (relation) =>
            relation.foreignSchemaName === catalog.schemaName &&
            relation.foreignTableName === catalog.tableName &&
            relation.foreignColumnName === catalog.columnName,
        );
        const foreignKey = foreign
          ? `${foreign?.foreignSchemaName}.${foreign?.foreignTableName}.${foreign?.foreignColumnName}`
          : "";
        const composedDescription = [description, jsonLabel].join("/");
        return `| ${catalog.schemaName} | ${catalog.tableName} | ${catalog.columnName} | ${catalog.columnType} | ${foreignKey} | ${composedDescription} |`;
      })
      .join("\n");

    const warehousePrompt = [
      "# Catalog",
      tableMarkdownHeader,
      tableMarkdownSeparator,
      catalogTableMarkdown,
    ].join("\n");
    console.log("warehousePrompt", warehousePrompt);
    return warehousePrompt;
  }
}

export const warehouseService = new WarehouseService();
