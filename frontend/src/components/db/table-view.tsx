import { getMessageDetail } from "@/queries/message";
import { getWarehouseExecute } from "@/queries/warehouse";
import type { WarehouseQueryRow } from "@/queries/warehouse";
import { Box, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export type TableViewProps = {
  messageId: string;
  compact?: boolean;
};

export const TableView = ({ messageId, compact }: TableViewProps) => {
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
    if (compact) {
      return data?.rows.slice(0, 10);
    }

    return data?.rows;
  }, [data, compact]);

  const columns: ColumnDef<WarehouseQueryRow>[] = useMemo(() => {
    return (
      data?.fields.map((field) => ({
        header: field.columnName,
        accessorKey: field.columnName,
      })) ?? []
    );
  }, [data]);

  return (
    <Box>
      {rows && rows.length > 0 && columns?.length > 0 ? (
        <TableRender columns={columns} data={rows} />
      ) : (
        <Text>No data</Text>
      )}
    </Box>
  );
};

const TableRender = ({
  columns,
  data,
}: {
  columns: ColumnDef<WarehouseQueryRow>[];
  data: WarehouseQueryRow[];
}) => {
  const table = useReactTable({
    columns: columns ?? [],
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <Table.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {table.getRowModel().rows.map((row) => (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
