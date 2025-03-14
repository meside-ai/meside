import { getDrizzle } from "@/db/db";
import { warehouseTable } from "@/db/schema/warehouse";
import { firstOrNotFound } from "@/utils/toolkit";
import { eq } from "drizzle-orm";

export const retrieveWarehouseAssistant = async (props: {
  warehouseId: string;
}): Promise<{
  prompt: string;
}> => {
  const warehouse = firstOrNotFound(
    await getDrizzle()
      .select()
      .from(warehouseTable)
      .where(eq(warehouseTable.warehouseId, props.warehouseId)),
    "Warehouse not found",
  );

  const prompt = `You are ${warehouse.type} assistant`;

  return { prompt };
};
