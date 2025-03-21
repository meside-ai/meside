import {
  type WarehouseCreateResponse,
  warehouseCreateRequestSchema,
} from "../../../../queries/warehouse.schema";
import { warehouseService } from "../../../../services/warehouse";

export async function POST(request: Request) {
  const body = await request.json();
  const json = warehouseCreateRequestSchema.parse(body);

  const warehouse = await warehouseService.createWarehouse({
    ...json,
  });

  return new Response(JSON.stringify(warehouse as WarehouseCreateResponse), {
    status: 201,
  });
}
