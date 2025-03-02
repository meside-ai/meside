import { getDrizzle } from "@/db/db";
import { columnModel } from "@/db/schema/column";
import { warehouseTable } from "@/db/schema/warehouse";
import { BadRequestError } from "@/utils/error";
import { firstOrNotCreated } from "@/utils/toolkit";
import { and, eq, isNull } from "drizzle-orm";
import type { GetContent } from "../types/content.interface";

export const getSystemDbMessageContent: GetContent = async ({ message }) => {
  if (message.structure.type !== "systemDb") {
    throw new BadRequestError("System message is not a systemDb message");
  }

  const columns = await getDrizzle()
    .select()
    .from(columnModel)
    .where(
      and(
        eq(columnModel.warehouseId, message.structure.warehouseId),
        isNull(columnModel.deletedAt),
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
    "| Table Name | Column Name | Column Type | Description |";
  const tableMarkdownSeparator = "| --- | --- | --- | --- |";
  const columnTableMarkdown = columns
    .map((column) => {
      return `| ${column.tableName} | ${column.columnName} | ${column.columnType} | ${column.description} |`;
    })
    .join("\n");
  const warehouseType = warehouse.type;

  const content = `You are a ${warehouseType} expert. Given an input question, only result query sql.
  Table schema:
  ${tableMarkdownHeader}
  ${tableMarkdownSeparator}
  ${columnTableMarkdown}
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
