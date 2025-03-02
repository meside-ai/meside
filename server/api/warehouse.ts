import { getDrizzle } from "@/db/db";
import { columnModel } from "@/db/schema/column";
import { messageTable } from "@/db/schema/message";
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
import { and, eq, isNull } from "drizzle-orm";
import {
  warehouseCreateRoute,
  warehouseDetailRoute,
  warehouseExecuteRoute,
  warehouseListRoute,
  warehouseTableRoute,
} from "./warehouse.schema";

export const warehouseApi = new OpenAPIHono()
  .openapi(warehouseCreateRoute, async (c) => {
    const body = c.req.valid("json");
    const auth = getAuthOrUnauthorized(c);

    const warehouseFactory = new WarehouseFactory().create("postgresql");
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
    });
  })
  .openapi(warehouseListRoute, async (c) => {
    const warehouses = await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(isNull(warehouseTable.deletedAt));

    const warehouseDtos = await getWarehouseDtos(warehouses);

    return c.json({ warehouses: warehouseDtos });
  })
  .openapi(warehouseExecuteRoute, async (c) => {
    const { messageId, warehouseId } = c.req.valid("json");

    const message = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(messageTable)
        .where(eq(messageTable.messageId, messageId))
        .limit(1),
      "Message not found",
    );

    if (!message) {
      throw new NotFoundError("Message not found");
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

    if (!("sql" in message.structure)) {
      throw new BadRequestError("Message has no SQL field");
    }

    const sql = message.structure.sql;
    const warehouseFactory = new WarehouseFactory().create("postgresql");
    const warehouseResult = await warehouseFactory.query(warehouse, sql);

    return c.json(warehouseResult);
  })
  .openapi(warehouseTableRoute, async (c) => {
    const { tableName, warehouseId, limit } = c.req.valid("json");

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

    const column = firstOrNotFound(
      await getDrizzle()
        .select()
        .from(columnModel)
        .where(eq(columnModel.tableName, tableName))
        .limit(1),
      "Table not found",
    );

    if (!column) {
      throw new NotFoundError("Table not found");
    }

    const sql = `SELECT * FROM ${tableName} LIMIT ${limit}`;

    const warehouseFactory = new WarehouseFactory().create("postgresql");

    const warehouseResult = await warehouseFactory.query(warehouse, sql);

    return c.json(warehouseResult);
  })
  .openapi(warehouseDetailRoute, async (c) => {
    const body = c.req.valid("json");

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

    return c.json({ warehouse: warehouseDto[0] });
  });

export type WarehouseApiType = typeof warehouseApi;
