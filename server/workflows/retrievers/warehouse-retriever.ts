import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { relationTable } from "@/db/schema/relation";
import { warehouseTable } from "@/db/schema/warehouse";
import { firstOrNotCreated } from "@/utils/toolkit";
import { eq, isNull } from "drizzle-orm";
import { and } from "drizzle-orm";

export const retrieveWarehouse = async (props: {
  warehouseId: string;
}): Promise<{
  warehousePrompt: string;
  warehouseType: string;
}> => {
  const catalogs = await getDrizzle()
    .select()
    .from(catalogTable)
    .where(
      and(
        eq(catalogTable.warehouseId, props.warehouseId),
        isNull(catalogTable.deletedAt),
      ),
    );
  const relations = await getDrizzle()
    .select()
    .from(relationTable)
    .where(
      and(
        eq(relationTable.warehouseId, props.warehouseId),
        isNull(relationTable.deletedAt),
      ),
    );
  const warehouse = firstOrNotCreated(
    await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.warehouseId, props.warehouseId)),
    "Warehouse not found",
  );
  const tableMarkdownHeader =
    "| Schema Name | Table Name | Column Name | Column Type | Foreign Key | Description |";
  const tableMarkdownSeparator = "| --- | --- | --- | --- | --- | --- |";
  const catalogTableMarkdown = catalogs
    .map((catalog) => {
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
      return `| ${catalog.schemaName} | ${catalog.tableName} | ${catalog.columnName} | ${catalog.columnType} | ${foreignKey} | ${description} |`;
    })
    .join("\n");

  const warehousePrompt = [
    "# Catalog",
    tableMarkdownHeader,
    tableMarkdownSeparator,
    catalogTableMarkdown,
  ].join("\n");

  const warehouseType = warehouse.type;

  return { warehousePrompt, warehouseType };
};
