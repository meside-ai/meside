import type { WarehouseEntity } from "@/db/schema/warehouse";
import { PostgresWarehouse } from "./postgres";
import type { Warehouse } from "./warehouse.interface";

export class WarehouseFactory {
  create(type: WarehouseEntity["type"]): Warehouse {
    switch (type) {
      case "postgresql":
        return new PostgresWarehouse();
      default:
        throw new Error(`Unsupported warehouse type: ${type}`);
    }
  }
}
