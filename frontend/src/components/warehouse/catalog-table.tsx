import {
  type CatalogDto,
  getCatalogList,
  getCatalogLoad,
} from "@/queries/catalog";
import { getLabelLoad } from "@/queries/label";
import { agGridDarkTheme } from "@/utils/ag-grid";
import { Box, Button, Group } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useState } from "react";

export type CatalogTableProps = {
  warehouseId: string;
};

export const CatalogTable = ({ warehouseId }: CatalogTableProps) => {
  const queryClient = useQueryClient();

  const catalogListResult = useQuery(getCatalogList({ warehouseId }));

  const catalogLoadMutation = useMutation({
    ...getCatalogLoad(),
    onSuccess: () => {
      queryClient.invalidateQueries(getCatalogList({ warehouseId }));
    },
  });

  const labelLoadMutation = useMutation({
    ...getLabelLoad(),
    onSuccess: () => {
      queryClient.invalidateQueries(getCatalogList({ warehouseId }));
    },
  });

  const rowData = useMemo<CatalogDto[]>(() => {
    return catalogListResult.data?.catalogs ?? [];
  }, [catalogListResult.data?.catalogs]);

  const [columnDefs] = useState<ColDef<CatalogDto>[]>([
    { field: "schemaName", spanRows: true, sort: "asc" },
    { field: "tableName", spanRows: true, sort: "asc" },
    { field: "columnName", minWidth: 250 },
    { field: "columnType", minWidth: 250 },
    { field: "foreign.fullName", minWidth: 250 },
    { field: "description", minWidth: 250, tooltipField: "description" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  const onGridReady = useCallback(() => {}, []);

  return (
    <Box
      h="100%"
      display="flex"
      style={{ flexDirection: "column", overflow: "hidden" }}
    >
      <Group mb="xs">
        <Button
          variant="light"
          size="xs"
          onClick={() =>
            warehouseId && catalogLoadMutation.mutateAsync({ warehouseId })
          }
          leftSection={<IconRefresh size={16} />}
          loading={catalogLoadMutation.isPending}
          disabled={catalogListResult.isFetching}
        >
          reload columns
        </Button>
        <Button
          variant="light"
          size="xs"
          onClick={() =>
            warehouseId && labelLoadMutation.mutateAsync({ warehouseId })
          }
          leftSection={<IconRefresh size={16} />}
          loading={labelLoadMutation.isPending}
          disabled={catalogListResult.isFetching}
        >
          re-label columns
        </Button>
      </Group>
      <Box style={{ flexGrow: 1, overflow: "hidden" }}>
        <AgGridReact<CatalogDto>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableCellSpan={true}
          tooltipShowDelay={500}
          onGridReady={onGridReady}
          theme={agGridDarkTheme}
        />
      </Box>
    </Box>
  );
};
