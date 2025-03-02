import type { ColumnListResponse } from "@/api/column.schema";
import { getColumnList, getColumnLoad } from "@/queries/column";
import {
  Box,
  Button,
  Group,
  Paper,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export type WarehouseEditorProps = {
  warehouseId: string;
};

export const WarehouseEditor = ({ warehouseId }: WarehouseEditorProps) => {
  const queryClient = useQueryClient();

  const columnListResult = useQuery(getColumnList({ warehouseId }));

  const tables = useMemo(() => {
    // group by tableName
    return columnListResult.data?.columns.reduce(
      (acc, item) => {
        acc[item.tableName] = [
          ...(acc[item.tableName] || []),
          {
            ...item,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deletedAt: item.deletedAt,
          },
        ];
        return acc;
      },
      {} as Record<string, ColumnListResponse["columns"]>
    );
  }, [columnListResult.data?.columns]);

  const columnLoadMutation = useMutation({
    ...getColumnLoad(),
    onSuccess: () => {
      queryClient.invalidateQueries(getColumnList({ warehouseId }));
    },
  });

  return (
    <Box
      h="100%"
      display="flex"
      style={{ flexDirection: "column", overflow: "hidden" }}
    >
      <Box flex={1} style={{ overflow: "hidden" }}>
        <ScrollArea h="100%">
          <Paper p="md" shadow="none">
            {!columnListResult.isFetching && (
              <Box>
                <Button
                  onClick={() =>
                    warehouseId &&
                    columnLoadMutation.mutateAsync({ warehouseId })
                  }
                >
                  refresh columns
                </Button>
              </Box>
            )}
            {tables && <TableList tables={tables} />}
          </Paper>
        </ScrollArea>
      </Box>
    </Box>
  );
};

const TableList = ({
  tables,
}: {
  tables: Record<string, ColumnListResponse["columns"]>;
}) => {
  return (
    <Box>
      {Object.entries(tables).map(([tableName, columns]) => (
        <Box key={tableName}>
          <Title order={6}>{tableName}</Title>
          <Box pl="md">
            {columns.map((column) => (
              <Group key={column.columnId} justify="space-between">
                <Text>{column.columnName}</Text>
                <Text size="xs">{column.columnType}</Text>
              </Group>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
