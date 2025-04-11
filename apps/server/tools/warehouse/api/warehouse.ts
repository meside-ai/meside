import { OpenAPIHono } from "@hono/zod-openapi";
import {
  type WarehouseDetailResponse,
  warehouseCreateRequestSchema,
  warehouseCreateRoute,
  warehouseDetailRoute,
  warehouseListRoute,
  warehouseUpdateRequestSchema,
  warehouseUpdateRoute,
} from "@meside/shared/api/warehouse.schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDrizzle } from "../../../db/db";
import {
  authGuardMiddleware,
  orgGuardMiddleware,
} from "../../../middleware/guard";
import { getAuthOrUnauthorized } from "../../../utils/auth";
import { cuid } from "../../../utils/cuid";
import { firstOrNotCreated, firstOrNull } from "../../../utils/toolkit";
import { getWarehouseDtos } from "../mapper/warehouse";
import { warehouseTable } from "../table/warehouse";

export const warehouseApi = new OpenAPIHono();

warehouseApi.use("*", authGuardMiddleware).use("*", orgGuardMiddleware);

warehouseApi.openapi(warehouseListRoute, async (c) => {
  const auth = getAuthOrUnauthorized(c);

  const warehouses = await getDrizzle()
    .select()
    .from(warehouseTable)
    .where(
      and(
        eq(warehouseTable.orgId, auth.orgId),
        isNull(warehouseTable.deletedAt),
      ),
    )
    .orderBy(desc(warehouseTable.createdAt));

  const warehouseDtos = await getWarehouseDtos(warehouses);
  return c.json({ warehouses: warehouseDtos });
});

warehouseApi.openapi(warehouseDetailRoute, async (c) => {
  const { warehouseId } = c.req.valid("json");
  const auth = getAuthOrUnauthorized(c);

  const warehouse = firstOrNull(
    await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(
        and(
          eq(warehouseTable.warehouseId, warehouseId),
          eq(warehouseTable.orgId, auth.orgId),
          isNull(warehouseTable.deletedAt),
        ),
      )
      .limit(1),
  );

  if (!warehouse) {
    return c.json({ warehouse: null });
  }

  const warehouseDtos = await getWarehouseDtos([warehouse]);

  return c.json({ warehouse: warehouseDtos[0] } as WarehouseDetailResponse);
});

warehouseApi.openapi(warehouseCreateRoute, async (c) => {
  const body = warehouseCreateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);
  const warehouseId = cuid();

  const warehouses = await getDrizzle()
    .insert(warehouseTable)
    .values({
      warehouseId,
      name: body.name,
      provider: body.provider,
      ownerId: auth.userId,
      orgId: auth.orgId,
    })
    .returning();

  const warehouse = firstOrNotCreated(warehouses, "Failed to create warehouse");

  return c.json({ warehouseId: warehouse.warehouseId });
});

warehouseApi.openapi(warehouseUpdateRoute, async (c) => {
  const body = warehouseUpdateRequestSchema.parse(await c.req.json());
  const auth = getAuthOrUnauthorized(c);

  const updateData: Partial<typeof warehouseTable.$inferInsert> = {};

  if (body.name) {
    updateData.name = body.name;
  }

  if (body.provider) {
    updateData.provider = body.provider;
  }

  // Only update if there are fields to update
  if (Object.keys(updateData).length > 0) {
    await getDrizzle()
      .update(warehouseTable)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(warehouseTable.warehouseId, body.warehouseId),
          eq(warehouseTable.orgId, auth.orgId),
          isNull(warehouseTable.deletedAt),
        ),
      );
  }

  return c.json({});
});
