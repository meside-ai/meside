import {
  type CatalogDto,
  getCatalogList,
  getCatalogLoad,
} from "@/queries/catalog";
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

  const catalogListResult = useQuery(getCatalogList({ warehouseId }));

  const tables = useMemo(() => {
    // group by tableName
    return catalogListResult.data?.catalogs.reduce(
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
      {} as Record<string, CatalogDto[]>
    );
  }, [catalogListResult.data?.catalogs]);

  const catalogLoadMutation = useMutation({
    ...getCatalogLoad(),
    onSuccess: () => {
      queryClient.invalidateQueries(getCatalogList({ warehouseId }));
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
            {!catalogListResult.isFetching && (
              <Box>
                <Button
                  onClick={() =>
                    warehouseId &&
                    catalogLoadMutation.mutateAsync({ warehouseId })
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

const TableList = ({ tables }: { tables: Record<string, CatalogDto[]> }) => {
  return (
    <Box>
      {Object.entries(tables).map(([tableName, catalogs]) => (
        <Box key={tableName}>
          <Title order={6}>
            {catalogs[0].schemaName}.{tableName}
          </Title>
          <Box pl="md">
            {catalogs.map((catalog) => (
              <Group key={catalog.catalogId} justify="space-between">
                <Text>{catalog.columnName}</Text>
                <Text size="xs">{catalog.columnType}</Text>
              </Group>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
