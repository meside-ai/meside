import { getWarehouseDetail } from "@/queries/warehouse";
import { Box, Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { TbBrandGoogleBigQuery } from "react-icons/tb";

export type WarehouseTitleProps = {
  warehouseId: string;
};

export const WarehouseTitle = ({ warehouseId }: WarehouseTitleProps) => {
  const { data } = useQuery(getWarehouseDetail({ warehouseId }));

  const icon = useMemo(() => {
    if (!data?.warehouse) {
      return null;
    }

    if (data.warehouse.type === "postgresql") {
      return <BiLogoPostgresql size={36} />;
    }

    if (data.warehouse.type === "bigquery") {
      return <TbBrandGoogleBigQuery size={36} />;
    }

    return null;
  }, [data?.warehouse]);

  if (!data?.warehouse) {
    return null;
  }

  return (
    <Group wrap="nowrap" align="center">
      {icon}
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
