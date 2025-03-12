import { getDrizzle } from "@/db/db";
import { catalogTable } from "@/db/schema/catalog";
import { type WarehouseEntity, warehouseTable } from "@/db/schema/warehouse";
import { getLogger } from "@/logger";
import { firstOrNotCreated } from "@/utils/toolkit";
import { WarehouseFactory } from "@/warehouse";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type Label = {
  schemaName: string;
  tableName: string;
  columnName: string;
  label: string;
};

const logger = getLogger("label-agent");

export class LabelAgent {
  async getLabelsByAgent({
    warehouseId,
  }: {
    warehouseId: string;
  }): Promise<Label[]> {
    const warehouse = firstOrNotCreated(
      await getDrizzle()
        .select()
        .from(warehouseTable)
        .where(eq(warehouseTable.warehouseId, warehouseId)),
      "Warehouse not found",
    );

    if (!warehouse) {
      throw new Error("Warehouse not found");
    }

    const catalogs = await getDrizzle()
      .select()
      .from(catalogTable)
      .where(eq(catalogTable.warehouseId, warehouseId));

    const labelMaps: Label[] = [];

    logger.info("start label agent");

    for (const catalog of catalogs) {
      if (
        catalog.columnType.toLowerCase().startsWith("json") &&
        catalog.description === null
      ) {
        const labelMap = await this.runLabelAgent({
          warehouse,
          catalog,
        });
        labelMaps.push(labelMap);
      }
    }

    logger.info("end label agent");

    return labelMaps;
  }

  async runLabelAgent(props: {
    warehouse: WarehouseEntity;
    catalog: {
      schemaName: string;
      tableName: string;
      columnName: string;
      columnType: string;
    };
  }): Promise<{
    schemaName: string;
    tableName: string;
    columnName: string;
    label: string;
  }> {
    const warehouseFactory = new WarehouseFactory().create(
      props.warehouse.type,
    );
    logger
      .child({
        schemaName: props.catalog.schemaName,
        tableName: props.catalog.tableName,
        columnName: props.catalog.columnName,
      })
      .info("start runLabelAgent");
    const rows = await warehouseFactory.getColumnSample(
      props.warehouse,
      props.catalog.schemaName,
      props.catalog.tableName,
      props.catalog.columnName,
      3,
    );

    const resultLength = rows.filter((row) => row.sample !== null).length;

    if (resultLength === 0) {
      return {
        schemaName: props.catalog.schemaName,
        tableName: props.catalog.tableName,
        columnName: props.catalog.columnName,
        label: "",
      };
    }

    const prompt = [
      "You are Meside, an AI agent created by the Meside team.",
      "You excel at the following tasks:",
      "1. according to the sample data, return typescript type",
      "2. return in a line, no newline character",
      "3. set all properties to optional",
      "4. return like: { thumb_image_url?: string; image_url?: string; video_url?: string | null; width?: number; }",
      "5. return only type definition, no other text",
      `7. database type is ${props.warehouse.type}`,
      "sample data:",
      rows
        .filter((row) => row.sample !== null)
        .map((row) => JSON.stringify(row?.sample))
        .join("\n"),
    ].join("\n");

    const result = await generateObject({
      model: openai("gpt-4o"),
      temperature: 0,
      schema: z.object({
        label: z.string(),
      }),
      prompt,
    });

    logger
      .child({
        object: JSON.stringify(result.object, null, 2),
      })
      .info("runLabelAgent AI result");

    return {
      schemaName: props.catalog.schemaName,
      tableName: props.catalog.tableName,
      columnName: props.catalog.columnName,
      label: result.object.label,
    };
  }
}
