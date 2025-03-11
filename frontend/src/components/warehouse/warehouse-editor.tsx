import {
  type CatalogDto,
  getCatalogList,
  getCatalogLoad,
} from "@/queries/catalog";
import { Box, Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";

export type CatalogTree = {
  fullName: string;
  firstName: string;
  secondName: string;
  schemaName: string;
  tableName: string;
  columnName: string;
  columnType: string;
  foreignFullName: string | null;
  description: string | null;
  subRows?: CatalogTree[];
};

export type WarehouseEditorProps = {
  warehouseId: string;
};

export const WarehouseEditor = ({ warehouseId }: WarehouseEditorProps) => {
  const queryClient = useQueryClient();

  const catalogListResult = useQuery(getCatalogList({ warehouseId }));

  const data = useMemo<CatalogTree[]>(() => {
    const catalogs = catalogListResult.data?.catalogs;
    if (!catalogs) return [];

    // Group by schema first, then by table
    const schemaMap: Record<string, Record<string, CatalogDto[]>> = {};

    for (const catalog of catalogs) {
      if (!schemaMap[catalog.schemaName]) {
        schemaMap[catalog.schemaName] = {};
      }

      if (!schemaMap[catalog.schemaName][catalog.tableName]) {
        schemaMap[catalog.schemaName][catalog.tableName] = [];
      }

      schemaMap[catalog.schemaName][catalog.tableName].push(catalog);
    }

    // Convert to tree structure
    return Object.entries(schemaMap).map(
      ([schemaName, tables]): CatalogTree => {
        // Schema level
        return {
          fullName: schemaName,
          firstName: schemaName,
          secondName: "",
          schemaName,
          tableName: "",
          columnName: "",
          columnType: "",
          foreignFullName: null,
          description: null,
          subRows: Object.entries(tables).map(
            ([tableName, columns]): CatalogTree => {
              // Table level
              return {
                fullName: `${schemaName}.${tableName}`,
                firstName: tableName,
                secondName: "",
                schemaName,
                tableName,
                columnName: "",
                columnType: "",
                foreignFullName: null,
                description: null,
                subRows: columns.map((column): CatalogTree => {
                  // Column level (with all real data)
                  return {
                    fullName: column.fullName,
                    firstName: "",
                    secondName: column.columnName,
                    schemaName: column.schemaName,
                    tableName: column.tableName,
                    columnName: column.columnName,
                    columnType: column.columnType,
                    foreignFullName: column?.foreign?.fullName
                      ? column.foreign.fullName
                      : null,
                    description: column.description,
                  };
                }),
              };
            }
          ),
        };
      }
    );
  }, [catalogListResult.data?.catalogs]);

  const columns = useMemo<MRT_ColumnDef<CatalogTree>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Schema and table Name",
      },
      {
        accessorKey: "secondName",
        header: "Column Name",
      },
      {
        accessorKey: "columnType",
        header: "Column Type",
      },
      {
        accessorKey: "foreignFullName",
        header: "Foreign Key",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  const catalogLoadMutation = useMutation({
    ...getCatalogLoad(),
    onSuccess: () => {
      queryClient.invalidateQueries(getCatalogList({ warehouseId }));
    },
  });

  const table = useMantineReactTable({
    debugAll: true,
    initialState: {
      density: "xs",
    },
    columns,
    data,
    enableExpanding: true,
    enableExpandAll: true,
    enableRowSelection: true, //enable some features
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: false, //turn off a feature
    enableRowVirtualization: true,
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
    renderTopToolbar: () => {
      return (
        <Box display="flex" style={{ justifyContent: "flex-end" }} p="md">
          {!catalogListResult.isFetching && (
            <Button
              variant="light"
              size="xs"
              onClick={() =>
                warehouseId && catalogLoadMutation.mutateAsync({ warehouseId })
              }
              leftSection={<IconRefresh size={16} />}
              loading={catalogLoadMutation.isPending}
            >
              refresh columns
            </Button>
          )}
        </Box>
      );
    },
  });

  return (
    <Box h="100%" style={{ overflow: "hidden" }}>
      <Box style={{ overflow: "hidden" }}>
        <MantineReactTable table={table} />
      </Box>
    </Box>
  );
};
