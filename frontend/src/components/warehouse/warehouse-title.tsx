import { getWarehouseDetail } from "@/queries/warehouse";
import { Box, Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { BiLogoPostgresql } from "react-icons/bi";

export type WarehouseTitleProps = {
  warehouseId: string;
};

export const WarehouseTitle = ({ warehouseId }: WarehouseTitleProps) => {
  const { data } = useQuery(getWarehouseDetail({ warehouseId }));

  if (!data?.warehouse) {
    return null;
  }

  return (
    <Group wrap="nowrap" align="center">
      <BiLogoPostgresql size={36} />
      <Box>
        <Text>{data.warehouse.name}</Text>
        <Text>
          postgres://{data.warehouse.username}:***{data.warehouse.host}:
          {data.warehouse.port}/{data.warehouse.database}
        </Text>
      </Box>
    </Group>
  );
};
