"use client";

import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getWarehouseQuery } from "../../../../queries/warehouse";
import { getWarehouseExecuteQuery } from "../../../../queries/warehouse";
import { SqlCodeBlock } from "./sql-code-block";
import { TableVirtualView } from "./table-virtual-view";

export default function WarehouseQueryPage() {
  const { query_id: queryId } = useParams<{ query_id: string }>();
  const { data: query } = useQuery(getWarehouseQuery(queryId));
  const { data: result } = useQuery(getWarehouseExecuteQuery(queryId));

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      {query && (
        <Box>
          <SqlCodeBlock sql={query.sql} />
        </Box>
      )}
      {result && (
        <Box flex={1} style={{ overflow: "hidden" }}>
          <TableVirtualView rows={result.rows} columns={result.fields} />
        </Box>
      )}
    </Box>
  );
}
