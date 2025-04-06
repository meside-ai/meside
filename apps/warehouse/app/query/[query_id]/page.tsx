import { warehouseService } from "../../../services/warehouse";
import { TableVirtualView } from "./table-virtual-view";
import "./page.module.css";
import { Box } from "@mantine/core";
import { SqlCodeBlock } from "./sql-code-block";

export default async function WarehouseQueryPage({
  params,
}: {
  params: { query_id: string };
}) {
  const queryId = params.query_id;
  const query = await warehouseService.getQuery(queryId);
  const result = await warehouseService.runQueryByWarehouseId(
    query.warehouseId,
    query.sql,
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Box>
        <SqlCodeBlock sql={query.sql} />
      </Box>
      <Box flex={1} style={{ overflow: "hidden" }}>
        <TableVirtualView rows={result.rows} columns={result.fields} />
      </Box>
    </Box>
  );
}
