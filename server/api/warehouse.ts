import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { questionTable } from "@/db/schema/question";
import { warehouseTable } from "@/db/schema/warehouse";
import { getWarehouseDtos } from "@/mappers/warehouse";
import { getAuthOrUnauthorized } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import { BadRequestError, NotFoundError } from "@/utils/error";
import {
  firstOrNotCreated,
  firstOrNotFound,
  firstOrNull,
} from "@/utils/toolkit";
import { WarehouseFactory } from "@/warehouse/warehouse";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type WarehouseCreateResponse,
  type WarehouseDetailResponse,
  type WarehouseExecuteResponse,
  type WarehouseListResponse,
  type WarehouseTableResponse,
  warehouseCreateRequestSchema,
  warehouseCreateRoute,
  warehouseDetailRequestSchema,
  warehouseDetailRoute,
  warehouseExecuteRequestSchema,
  warehouseExecuteRoute,
  warehouseListRoute,
  warehouseTableRequestSchema,
  warehouseTableRoute,
} from "@meside/shared/api/warehouse.schema";
import { and, eq, isNull } from "drizzle-orm";

export const warehouseApi = new OpenAPIHono()
  .openapi(warehouseCreateRoute, async (c) => {
    const body = warehouseCreateRequestSchema.parse(await c.req.json());
    const auth = getAuthOrUnauthorized(c);

    const warehouseFactory = new WarehouseFactory().create(body.type);
    const isConnected = await warehouseFactory.testConnection(body);

    if (!isConnected) {
      throw new BadRequestError("Failed to connect to warehouse");
    }

    const warehouse = firstOrNotCreated(
      await getDrizzle()
        .insert(warehouseTable)
        .values({
          ...body,
          warehouseId: cuid(),
          ownerId: auth.userId,
          orgId: auth.orgId,
        })
        .returning({
          warehouseId: warehouseTable.warehouseId,
        }),
      "Warehouse not created",
    );

    return c.json({
      warehouseId: warehouse.warehouseId,
    } as WarehouseCreateResponse);
  })
  .openapi(warehouseListRoute, async (c) => {
    const warehouses = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(isNull(warehouseTable.deletedAt));

    const warehouseDtos = await getWarehouseDtos(warehouses);

    return c.json({ warehouses: warehouseDtos } as WarehouseListResponse);
  })
  .openapi(warehouseExecuteRoute, async (c) => {
    const { questionId } = warehouseExecuteRequestSchema.parse(
      await c.req.json(),
    );

    const question = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(questionTable)
        .where(eq(questionTable.questionId, questionId))
        .limit(1),
      "Question not found",
    );

    const warehouseId =
      "warehouseId" in question.payload ? question.payload.warehouseId : null;
    const sql = "sql" in question.payload ? question.payload.sql : null;

    if (!warehouseId || !sql) {
      throw new BadRequestError(
        `Question has no warehouseId or sql, questionId: ${questionId}, warehouseId: ${warehouseId}, sql: ${sql}`,
      );
    }

    const warehouse = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(warehouseTable)
        .where(eq(warehouseTable.warehouseId, warehouseId))
        .limit(1),
      "Warehouse not found",
    );

    if (!warehouse) {
      throw new NotFoundError("Warehouse not found");
    }

    const warehouseFactory = new WarehouseFactory().create(warehouse.type);
    const warehouseResult = await warehouseFactory.query(warehouse, sql);

    return c.json(warehouseResult as WarehouseExecuteResponse);
  })
  .openapi(warehouseTableRoute, async (c) => {
    const { tableName, warehouseId, limit } = warehouseTableRequestSchema.parse(
      await c.req.json(),
    );

    const warehouse = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(warehouseTable)
        .where(eq(warehouseTable.warehouseId, warehouseId))
        .limit(1),
      "Warehouse not found",
    );

    if (!warehouse) {
      throw new NotFoundError("Warehouse not found");
    }

    const catalog = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(catalogTable)
        .where(eq(catalogTable.tableName, tableName))
        .limit(1),
      "Table not found",
    );

    if (!catalog) {
      throw new NotFoundError("Table not found");
    }

    const sql = `SELECT * FROM ${tableName} LIMIT ${limit}`;

    const warehouseFactory = new WarehouseFactory().create(warehouse.type);

    const warehouseResult = await warehouseFactory.query(warehouse, sql);

    return c.json(warehouseResult as WarehouseTableResponse);
  })
  .openapi(warehouseDetailRoute, async (c) => {
    const body = warehouseDetailRequestSchema.parse(await c.req.json());

    const warehouse = firstOrNull(
      await getDrizzle()
        .select()
        .from(warehouseTable)
        .where(
          and(
            eq(warehouseTable.warehouseId, body.warehouseId),
            isNull(warehouseTable.deletedAt),
          ),
        )
        .limit(1),
    );

    if (!warehouse) {
      return c.json({ warehouse: null });
    }

    const warehouseDto = await getWarehouseDtos([warehouse]);

    return c.json({ warehouse: warehouseDto[0] } as WarehouseDetailResponse);
  });

export type WarehouseApiType = typeof warehouseApi;
