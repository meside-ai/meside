import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { labelTable } from "@/db/schema/label";
import { relationTable } from "@/db/schema/relation";
import { eq, isNull } from "drizzle-orm";
import { and } from "drizzle-orm";

// TODO refactor to use standard export
export const retrieveWarehouse = async (props: {
  warehouseId: string;
}): Promise<{
  warehousePrompt: string;
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
  const labels = await getDrizzle()
    .select()
    .from(labelTable)
    .where(eq(labelTable.warehouseId, props.warehouseId));

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

  return { warehousePrompt };
};
