"use client";

import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo } from "react";
import { agGridDarkTheme } from "../../../utils/ag-grid";
import type {
  WarehouseQueryColumn,
  WarehouseQueryRow,
} from "../../../warehouse/type";

export type TableVirtualViewProps = {
  rows: WarehouseQueryRow[];
  columns: WarehouseQueryColumn[];
};

export const TableVirtualView = ({ rows, columns }: TableVirtualViewProps) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const rowData = useMemo<any[]>(() => {
    if (!rows) {
      return [];
    }
    return rows.map((row, index) => ({
      $_internal_index_$: index + 1,
      ...row,
    }));
  }, [rows]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const columnDefs = useMemo<ColDef<any>[]>(() => {
    const fields =
      columns.map((field) => ({
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
  }, [columns]);

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
    <div style={{ width: "100%", height: "100%" }}>
      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
      <AgGridReact<any>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableCellSpan={true}
        onGridReady={onGridReady}
        theme={agGridDarkTheme}
      />
    </div>
  );
};
