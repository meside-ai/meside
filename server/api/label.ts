import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { labelTable } from "@/db/schema/label";
import { getAuthOrUnauthorized } from "@/utils/auth";
import { cuid } from "@/utils/cuid";
import { LabelAgent } from "@/workflows/agents/label-agent";
import { OpenAPIHono } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { labelLoadRoute } from "./label.schema";

export const labelApi = new OpenAPIHono().openapi(labelLoadRoute, async (c) => {
  const { warehouseId } = c.req.valid("json");
  const auth = getAuthOrUnauthorized(c);

  const catalogs = await getDrizzle()
    .select()
    .from(catalogTable)
    .where(eq(catalogTable.warehouseId, warehouseId));
  const labels = await getDrizzle()
    .select()
    .from(labelTable)
    .where(eq(labelTable.warehouseId, warehouseId));

  const emptyLabelCatalogs = catalogs.filter((catalog) => {
    const label = labels.find(
      (label) => label.catalogFullName === catalog.fullName,
    );
    return !label || label.jsonLabel === null;
  });

  const labelAgent = new LabelAgent();
  const newLabels = await labelAgent.getLabelsByAgent({
    warehouseId,
    catalogs: emptyLabelCatalogs,
  });

  getDrizzle().transaction(async (tx) => {
    for (const newLabel of newLabels) {
      if (newLabel.label) {
        const catalogFullName = `${newLabel.schemaName}.${newLabel.tableName}.${newLabel.columnName}`;

        const existingLabels = await tx
          .select()
          .from(labelTable)
          .where(
            and(
              eq(labelTable.warehouseId, warehouseId),
              eq(labelTable.catalogFullName, catalogFullName),
            ),
          )
          .limit(1);

        if (existingLabels.length > 0) {
          await tx
            .update(labelTable)
            .set({
              jsonLabel: newLabel.label,
            })
            .where(
              and(
                eq(labelTable.warehouseId, warehouseId),
                eq(labelTable.catalogFullName, catalogFullName),
              ),
            );
        } else {
          await tx.insert(labelTable).values({
            labelId: cuid(),
            warehouseId,
            catalogFullName,
            jsonLabel: newLabel.label,
            orgId: auth.orgId,
          });
        }
      }
    }
  });

  return c.json({});
});

export type LabelApiType = typeof labelApi;
