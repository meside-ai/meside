import { getDrizzle } from "@/db/db";
import { columnModel } from "@/db/schema/column";
import { warehouseTable } from "@/db/schema/warehouse";
import { cuid } from "@/utils/cuid";
import { NotFoundError } from "@/utils/error";
import { WarehouseFactory } from "@/warehouse/warehouse";
import { OpenAPIHono } from "@hono/zod-openapi";
import { and, eq, ilike, isNull, or } from "drizzle-orm";
import {
  columnListRoute,
  columnLoadRoute,
  columnSuggestionRoute,
} from "./column.schema";

export const columnApi = new OpenAPIHono()
  .openapi(columnLoadRoute, async (c) => {
    const { warehouseId } = c.req.valid("json");

    const warehouses = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(
        and(
          eq(warehouseTable.warehouseId, warehouseId),
          isNull(warehouseTable.deletedAt),
        ),
      )
      .limit(1);
    const warehouse = warehouses[0];

    if (!warehouse) {
      throw new NotFoundError("Warehouse not found");
    }

    const warehouseFactory = new WarehouseFactory();
    const warehouseClass = warehouseFactory.create("postgresql");

    const columns = await warehouseClass.getColumns(warehouse);

    await getDrizzle()
      .delete(columnModel)
      .where(eq(columnModel.warehouseId, warehouseId));

    await getDrizzle()
      .insert(columnModel)
      .values(
        columns.map((column) => ({
          columnId: cuid(),
          warehouseId,
          ...column,
        })),
      );

    return c.json({});
  })
  .openapi(columnListRoute, async (c) => {
    const { warehouseId } = c.req.valid("json");
    const columns = await getDrizzle()
      .select()
      .from(columnModel)
      .where(
        and(
          eq(columnModel.warehouseId, warehouseId),
          isNull(columnModel.deletedAt),
        ),
      );

    return c.json({
      columns,
    });
  })
  .openapi(columnSuggestionRoute, async (c) => {
    const { warehouseId, keyword } = c.req.valid("json");

    const keywords = keyword.split(".");

    if (keywords.length === 1) {
      const tableSuggestions = await getTableOrColumnSuggestions(
        warehouseId,
        keyword,
      );

      return c.json({
        suggestions: tableSuggestions,
      });
    }

    if (keywords.length === 2) {
      const columnSuggestions = await getColumnSuggestions(
        warehouseId,
        keywords,
      );

      return c.json({
        suggestions: columnSuggestions,
      });
    }

    return c.json({
      suggestions: [],
    });
  });

const getTableOrColumnSuggestions = async (
  warehouseId: string,
  keyword: string,
): Promise<
  {
    id: string;
    label: string;
  }[]
> => {
  const columns = await getDrizzle()
    .select()
    .from(columnModel)
    .where(
      and(
        eq(columnModel.warehouseId, warehouseId),
        isNull(columnModel.deletedAt),
        or(
          ilike(columnModel.tableName, `%${keyword}%`),
          ilike(columnModel.columnName, `%${keyword}%`),
        ),
      ),
    )
    .limit(5);

  const columnSuggestions: {
    id: string;
    label: string;
  }[] = columns.map((column) => {
    return {
      id: column.columnId,
      label: `${column.tableName}.${column.columnName}`,
    };
  });

  return columnSuggestions.slice(0, 5);
};

const getColumnSuggestions = async (
  warehouseId: string,
  keyword: string[],
): Promise<
  {
    id: string;
    label: string;
  }[]
> => {
  const columns = await getDrizzle()
    .select()
    .from(columnModel)
    .where(
      and(
        eq(columnModel.warehouseId, warehouseId),
        isNull(columnModel.deletedAt),
        ilike(columnModel.tableName, `%${keyword[0]}%`),
        ilike(columnModel.columnName, `%${keyword[1]}%`),
      ),
    )
    .limit(5);

  return columns.map((column) => {
    return {
      id: column.columnId,
      label: `${column.tableName}.${column.columnName}`,
    };
  });
};

export type ColumnApiType = typeof columnApi;
