import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { relationTable } from "@/db/schema/relation";
import { warehouseTable } from "@/db/schema/warehouse";
import { BadRequestError } from "@/utils/error";
import { firstOrNotCreated } from "@/utils/toolkit";
import { and, eq, isNull } from "drizzle-orm";
import type { GetContent } from "../types/content.interface";

export const getSystemDbMessageContent: GetContent = async ({ message }) => {
  if (message.structure.type !== "systemDb") {
    throw new BadRequestError("System message is not a systemDb message");
  }

  const catalogs = await getDrizzle()
    .select()
    .from(catalogTable)
    .where(
      and(
        eq(catalogTable.warehouseId, message.structure.warehouseId),
        isNull(catalogTable.deletedAt),
      ),
    );
  const relations = await getDrizzle()
    .select()
    .from(relationTable)
    .where(
      and(
        eq(relationTable.warehouseId, message.structure.warehouseId),
        isNull(relationTable.deletedAt),
      ),
    );
  const warehouse = firstOrNotCreated(
    await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.warehouseId, message.structure.warehouseId)),
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
  const warehouseType = warehouse.type;

  const content = `You are a ${warehouseType} expert. Given an input question, only result query sql.
  Table schema:
  ${tableMarkdownHeader}
  ${tableMarkdownSeparator}
  ${catalogTableMarkdown}
  `;

  return {
    content,
  };
};

export const getAssistantDbMessageContent: GetContent = async ({ message }) => {
  if (message.structure.type !== "assistantDb") {
    throw new BadRequestError("Assistant message is not a assistantDb message");
  }

  const content = message.structure.sql;

  return {
    content,
  };
};
