import { and, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../../db/db";
import { cuid } from "../../../utils/cuid";
import { firstOrNotCreated, firstOrNotFound } from "../../../utils/toolkit";
import { WarehouseFactory } from "../factory/warehouse";
import type {
  WarehouseQueryColumn,
  WarehouseQueryRow,
} from "../factory/warehouse.type";
import { catalogTable } from "../table/catalog";
import { labelTable } from "../table/label";
import { queryTable } from "../table/query";
import { relationTable } from "../table/relation";
import { type WarehouseEntity, warehouseTable } from "../table/warehouse";

class WarehouseService {
  private warehouseFactory = new WarehouseFactory();

  async getWarehouses(): Promise<
    {
      warehouseId: string;
      name: string;
      type: string;
    }[]
  > {
    const warehouses = await getDrizzle().select().from(warehouseTable);

    return warehouses.map((warehouse) => ({
      warehouseId: warehouse.warehouseId,
      name: warehouse.name,
      type: warehouse.provider.type,
    }));
  }

  private async getWarehouseByName(
    warehouseName: string,
  ): Promise<WarehouseEntity> {
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

  private async getWarehouseById(
    warehouseId: string,
  ): Promise<WarehouseEntity> {
    const warehouses = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.warehouseId, warehouseId))
      .limit(1);

    const warehouse = firstOrNotFound(
      warehouses,
      `Warehouse with id ${warehouseId} not found`,
    );

    return warehouse;
  }

  async getTables(warehouseName: string) {
    try {
      const warehouse = await this.getWarehouseByName(warehouseName);

      const warehouseInstance = this.warehouseFactory.create(
        warehouse.provider.type,
      );
      const catalogs = await warehouseInstance.getCatalogs(warehouse.provider);

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
      const warehouse = await this.getWarehouseByName(warehouseName);

      const warehouseInstance = this.warehouseFactory.create(
        warehouse.provider.type,
      );
      const catalogs = await warehouseInstance.getCatalogs(warehouse.provider);
      const relations = await warehouseInstance.getRelations(
        warehouse.provider,
      );

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
    warehouseName: string,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
    queryUrl: string;
  }> {
    const warehouse = await this.getWarehouseByName(warehouseName);
    const warehouseInstance = this.warehouseFactory.create(
      warehouse.provider.type,
    );
    const result = await warehouseInstance.query(warehouse.provider, sql);
    const query = await this.createQuery(warehouse, sql, result.fields);
    const queryUrl = `https://p.meside.com/meside/warehouse/query/${query.queryId}`;

    return {
      ...result,
      queryUrl,
    };
  }

  async runQueryByWarehouseId(
    warehouseId: string,
    sql: string,
  ): Promise<{
    rows: WarehouseQueryRow[];
    fields: WarehouseQueryColumn[];
  }> {
    const warehouse = await this.getWarehouseById(warehouseId);
    const warehouseInstance = this.warehouseFactory.create(
      warehouse.provider.type,
    );
    const result = await warehouseInstance.query(warehouse.provider, sql);

    return result;
  }

  async createQuery(
    warehouse: WarehouseEntity,
    sql: string,
    fields: WarehouseQueryColumn[],
  ): Promise<{ queryId: string }> {
    const ownerId = "1"; // TODO: get ownerId from session
    const orgId = "1"; // TODO: get orgId from session
    const query = await getDrizzle()
      .insert(queryTable)
      .values({
        queryId: cuid(),
        warehouseId: warehouse.warehouseId,
        sql,
        fields,
        ownerId,
        orgId,
      })
      .returning({
        queryId: queryTable.queryId,
      });

    return firstOrNotFound(query, "Failed to create query");
  }

  async getCatalogs(warehouseName: string) {
    const warehouse = await this.getWarehouseByName(warehouseName);
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
    return warehousePrompt;
  }

  async getQuery(queryId: string) {
    const query = await getDrizzle()
      .select()
      .from(queryTable)
      .where(eq(queryTable.queryId, queryId));
    return firstOrNotFound(query, "Query not found");
  }

  async testConnection(warehouseName: string) {
    const warehouse = await this.getWarehouseByName(warehouseName);
    const warehouseInstance = this.warehouseFactory.create(
      warehouse.provider.type,
    );
    return warehouseInstance.testConnection(warehouse.provider);
  }

  async createWarehouse(
    body: Omit<
      WarehouseEntity,
      "warehouseId" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ): Promise<{ warehouseId: string }> {
    const warehouse = await getDrizzle()
      .insert(warehouseTable)
      .values({
        ...body,
        warehouseId: cuid(),
      })
      .returning({
        warehouseId: warehouseTable.warehouseId,
      });

    return firstOrNotCreated(warehouse, "Failed to create warehouse");
  }

  async updateWarehouse(
    warehouseId: string,
    body: Partial<WarehouseEntity>,
  ): Promise<void> {
    await getDrizzle()
      .update(warehouseTable)
      .set(body)
      .where(eq(warehouseTable.warehouseId, warehouseId));
  }

  async deleteWarehouse(warehouseId: string): Promise<void> {
    await getDrizzle()
      .update(warehouseTable)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(warehouseTable.warehouseId, warehouseId));
  }

  async getWarehouseList(): Promise<WarehouseEntity[]> {
    const warehouses = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(and(isNull(warehouseTable.deletedAt)));

    return warehouses;
  }

  async getWarehouseDetail(body: {
    warehouseId: string;
  }): Promise<WarehouseEntity> {
    const warehouse = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.warehouseId, body.warehouseId));

    return firstOrNotFound(warehouse, "Warehouse not found");
  }
}

export const warehouseService = new WarehouseService();
