import { getWarehouseExecute } from "@/queries/warehouse";
import { agGridDarkTheme } from "@/utils/ag-grid";
import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo } from "react";

export type TableVirtualViewProps = {
  questionId: string;
};

export const TableVirtualView = ({ questionId }: TableVirtualViewProps) => {
  const { data } = useQuery(
    getWarehouseExecute({
      questionId,
    })
  );

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const rowData = useMemo<any[]>(() => {
    if (!data?.rows) {
      return [];
    }
    return data.rows.map((row, index) => ({
      $_internal_index_$: index + 1,
      ...row,
    }));
  }, [data?.rows]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const columnDefs = useMemo<ColDef<any>[]>(() => {
    const fields =
      data?.fields.map((field) => ({
        field: field.columnName,
        initialWidth: 100,
      })) ?? [];

    return [
      {
        field: "$_internal_index_$",
        headerName: " ",
        minWidth: 50,
        maxWidth: 50,
        width: 50,
        pinned: "left",
        // fix width in ag-grid
        resizable: false,
        sortable: false,
        filter: false,
        suppressMovable: false,
      },
      ...fields,
    ];
  }, [data?.fields]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
      resizable: true,
    };
  }, []);

  const onGridReady = useCallback(() => {}, []);

  return (
    <Box w="100%" h="100%">
      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
      <AgGridReact<any>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableCellSpan={true}
        onGridReady={onGridReady}
        theme={agGridDarkTheme}
      />
    </Box>
  );
};
