import { getWarehouseList } from "@/queries/warehouse";
import { Box, Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type WarehouseSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const WarehouseSelect = ({ value, onChange }: WarehouseSelectProps) => {
  const { data } = useQuery(getWarehouseList());

  const warehouseOptions = useMemo(() => {
    return (
      data?.warehouses.map((item) => ({
        value: item.warehouseId,
        label: item.name,
      })) ?? []
    );
  }, [data]);

  return (
    <Box>
      <Select
        data={warehouseOptions}
        placeholder="Source warehouse"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};
