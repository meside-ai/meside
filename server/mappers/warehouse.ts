import type { WarehouseDto } from "@/api/warehouse.schema";
import { getDrizzle } from "@/db/db";
import { userTable } from "@/db/schema/user";
import type { WarehouseEntity } from "@/db/schema/warehouse";
import { inArray } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";

export const getWarehouseDtos = async (
  warehouses: WarehouseEntity[],
): Promise<WarehouseDto[]> => {
  const userIds = uniq(warehouses.map((x) => x.ownerId).filter((x) => x));

  const users = await getDrizzle()
    .select()
    .from(userTable)
    .where(inArray(userTable.userId, userIds));

  return warehouses.map((warehouse) => {
    const owner = users.find((user) => user.userId === warehouse.ownerId);

    return {
      warehouseId: warehouse.warehouseId,
      name: warehouse.name,
      type: warehouse.type,
      host: warehouse.host,
      port: warehouse.port,
      username: warehouse.username,
      database: warehouse.database,
      schema: warehouse.schema,
      ownerId: warehouse.ownerId,
      orgId: warehouse.orgId,
      owner: owner
        ? {
            userId: owner.userId,
            name: owner.name,
            avatar: owner.avatar,
          }
        : undefined,
    };
  });
};
