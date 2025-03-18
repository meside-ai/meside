import { getDrizzle } from "@/db/db";
import type { CatalogEntity } from "@/db/schema/catalog";
import { relationTable } from "@/db/schema/relation";
import type { CatalogDto } from "@meside/shared/api/catalog.schema";
import { and, inArray, isNull } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";

export const getCatalogDtos = async (
  catalogs: CatalogEntity[],
): Promise<CatalogDto[]> => {
  const warehouseIds = uniq(
    catalogs.map((x) => x.warehouseId).filter((x) => x),
  );
  const relations = await getDrizzle()
    .select()
    .from(relationTable)
    .where(
      and(
        inArray(relationTable.warehouseId, warehouseIds),
        isNull(relationTable.deletedAt),
      ),
    );

  const catalogsDto = catalogs.map((catalog) => {
    const relation = relations.find(
      (relation) =>
        relation.schemaName === catalog.schemaName &&
        relation.tableName === catalog.tableName &&
        relation.columnName === catalog.columnName,
    );

    return {
      fullName: catalog.fullName,
      schemaName: catalog.schemaName,
      tableName: catalog.tableName,
      columnName: catalog.columnName,
      warehouseType: catalog.warehouseType,
      columnType: catalog.columnType,
      description: catalog.description,
      createdAt: catalog.createdAt,
      updatedAt: catalog.updatedAt,
      deletedAt: catalog.deletedAt,
      foreign: relation
        ? {
            fullName: relation.foreignFullName,
            schemaName: relation.foreignSchemaName,
            tableName: relation.foreignTableName,
            columnName: relation.foreignColumnName,
          }
        : undefined,
    } as CatalogDto;
  });

  return catalogsDto;
};
