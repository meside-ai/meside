import type { WarehouseDto } from "@meside/shared/api/warehouse.schema";
import { inArray } from "drizzle-orm";
import { uniq } from "es-toolkit/compat";
import { getUserDtos } from "../../../agent/mapper/user";
import { userTable } from "../../../agent/table/user";
import { getDrizzle } from "../../../db/db";
import type { WarehouseEntity } from "../table/warehouse";

export const getWarehouseDtos = async (
  warehouses: WarehouseEntity[],
): Promise<WarehouseDto[]> => {
  const userIds = uniq(
    warehouses
      .map((warehouse) => warehouse.ownerId)
      .filter((ownerId) => ownerId !== null),
  );

  const userDtos = await getUserDtos(
    await getDrizzle()
      .select()
      .from(userTable)
      .where(inArray(userTable.userId, userIds)),
  );

  const warehouseDtos = warehouses.map((warehouse) => {
    const owner = userDtos.find((user) => user.userId === warehouse.ownerId);

    return {
      ...warehouse,
      owner,
    } as WarehouseDto;
  });

  return warehouseDtos;
};
