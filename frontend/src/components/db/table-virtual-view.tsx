import { getMessageDetail } from "@/queries/message";
import { getWarehouseExecute } from "@/queries/warehouse";
import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  type MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";
export type TableVirtualViewProps = {
  messageId: string;
};

export const TableVirtualView = ({ messageId }: TableVirtualViewProps) => {
  const messageDetailResult = useQuery(getMessageDetail({ messageId }));

  const structure = messageDetailResult.data?.message?.structure;

  const { data } = useQuery(
    getWarehouseExecute({
      warehouseId:
        structure && "warehouseId" in structure ? structure.warehouseId : "",
      messageId,
    })
  );

  const rows = useMemo(() => {
    return data?.rows;
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    return (
      data?.fields.map((field) => ({
        header: field.columnName,
        accessorKey: field.columnName,
        minSize: 50,
        maxSize: 200,
      })) ?? []
    );
  }, [data]);

  const table = useMantineReactTable({
    initialState: {
      density: "xs",
    },
    columns,
    data: rows ?? [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true, //enable some features
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: false, //turn off a feature
    enableRowVirtualization: true,
    enableColumnVirtualization: true,
    enablePagination: false,
    enableDensityToggle: false,
    enableColumnResizing: true,
    mantinePaperProps: {
      style: {
        // "--mantine-spacing-xs": "2px",
      },
    },
    mantineTableProps: {
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
      style: {
        "--table-horizontal-spacing": "5px",
        "--table-vertical-spacing": "2px",
      },
    },
    mantineSelectCheckboxProps: {
      size: "xs",
      radius: 4,
    },
    mantineSelectAllCheckboxProps: {
      size: "xs",
      radius: 4,
    },
  });

  return (
    <Box w="100%" h="100%">
      <MantineReactTable table={table} />
    </Box>
  );
};
