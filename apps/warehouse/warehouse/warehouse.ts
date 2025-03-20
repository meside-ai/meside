import type { WarehouseEntity } from "../db/schema/warehouse";
import type { Warehouse } from "./warehouse.interface";
import { BigqueryWarehouse } from "./warehouse/bigquery";
import { MysqlWarehouse } from "./warehouse/mysql";
import { OracleWarehouse } from "./warehouse/oracle";
import { PostgresWarehouse } from "./warehouse/postgres";

export class WarehouseFactory {
  create(type: WarehouseEntity["type"]): Warehouse {
    switch (type) {
      case "postgresql":
        return new PostgresWarehouse();
      case "bigquery":
        return new BigqueryWarehouse();
      case "mysql":
        return new MysqlWarehouse();
      // case "oracle":
      //   return new OracleWarehouse();
      default:
        throw new Error(`Unsupported warehouse type: ${type}`);
    }
  }
}
