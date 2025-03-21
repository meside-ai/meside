import {
  type WarehouseDetailResponse,
  warehouseDetailRequestSchema,
} from "../../../../queries/warehouse.schema";
import { warehouseService } from "../../../../services/warehouse";

export async function POST(request: Request) {
  const body = await request.json();
  const json = warehouseDetailRequestSchema.parse(body);

  const warehouse = await warehouseService.getWarehouseDetail(json);

  return new Response(
    JSON.stringify({ warehouse } as WarehouseDetailResponse),
    {
      status: 201,
    },
  );
}
