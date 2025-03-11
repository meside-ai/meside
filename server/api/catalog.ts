import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { relationTable } from "@/db/schema/relation";
import { warehouseTable } from "@/db/schema/warehouse";
import { getCatalogDtos } from "@/mappers/catalog";
import { getAuthOrUnauthorized } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import { NotFoundError } from "@/utils/error";
import { WarehouseFactory } from "@/warehouse/warehouse";
import { OpenAPIHono } from "@hono/zod-openapi";
import { and, asc, eq, ilike, isNull, or } from "drizzle-orm";
import {
  catalogListRoute,
  catalogLoadRoute,
  catalogSuggestionRoute,
} from "./catalog.schema";

export const catalogApi = new OpenAPIHono()
  .openapi(catalogLoadRoute, async (c) => {
    const { warehouseId } = c.req.valid("json");
    const auth = getAuthOrUnauthorized(c);

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
    const warehouseClass = warehouseFactory.create(warehouse.type);

    const catalogs = await warehouseClass.getCatalogs(warehouse);
    const relations = await warehouseClass.getRelations(warehouse);

    await getDrizzle().transaction(async (tx) => {
      await tx
        .delete(catalogTable)
        .where(eq(catalogTable.warehouseId, warehouseId));

      if (catalogs.length > 0) {
        await tx.insert(catalogTable).values(
          catalogs.map((catalog) => ({
            ...catalog,
            catalogId: cuid(),
            warehouseId,
            orgId: auth.orgId,
            warehouseType: warehouse.type,
            fullName: `${catalog.schemaName}.${catalog.tableName}.${catalog.columnName}`,
          })),
        );
      }
    });

    await getDrizzle().transaction(async (tx) => {
      await tx
        .delete(relationTable)
        .where(eq(relationTable.warehouseId, warehouseId));

      if (relations.length > 0) {
        await tx.insert(relationTable).values(
          relations.map((relation) => ({
            ...relation,
            relationId: cuid(),
            warehouseId,
            orgId: auth.orgId,
            warehouseType: warehouse.type,
            fullName: `${relation.schemaName}.${relation.tableName}.${relation.columnName}`,
            foreignFullName: `${relation.foreignSchemaName}.${relation.foreignTableName}.${relation.foreignColumnName}`,
          })),
        );
      }
    });

    return c.json({});
  })
  .openapi(catalogListRoute, async (c) => {
    const { warehouseId } = c.req.valid("json");
    const catalogs = await getDrizzle()
      .select()
      .from(catalogTable)
      .where(
        and(
          eq(catalogTable.warehouseId, warehouseId),
          isNull(catalogTable.deletedAt),
        ),
      )
      .orderBy(asc(catalogTable.schemaName), asc(catalogTable.tableName));

    const catalogsDto = await getCatalogDtos(catalogs);

    return c.json({
      catalogs: catalogsDto,
    });
  })
  .openapi(catalogSuggestionRoute, async (c) => {
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
  const catalogs = await getDrizzle()
    .select()
    .from(catalogTable)
    .where(
      and(
        eq(catalogTable.warehouseId, warehouseId),
        isNull(catalogTable.deletedAt),
        or(
          ilike(catalogTable.tableName, `%${keyword}%`),
          ilike(catalogTable.columnName, `%${keyword}%`),
        ),
      ),
    )
    .limit(5);

  const catalogSuggestions: {
    id: string;
    label: string;
  }[] = catalogs.map((catalog) => {
    return {
      id: catalog.catalogId,
      label: `${catalog.tableName}.${catalog.columnName}`,
    };
  });

  return catalogSuggestions.slice(0, 5);
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
  const catalogs = await getDrizzle()
    .select()
    .from(catalogTable)
    .where(
      and(
        eq(catalogTable.warehouseId, warehouseId),
        isNull(catalogTable.deletedAt),
        ilike(catalogTable.tableName, `%${keyword[0]}%`),
        ilike(catalogTable.columnName, `%${keyword[1]}%`),
      ),
    )
    .limit(5);

  return catalogs.map((catalog) => {
    return {
      id: catalog.catalogId,
      label: `${catalog.tableName}.${catalog.columnName}`,
    };
  });
};

export type CatalogApiType = typeof catalogApi;
