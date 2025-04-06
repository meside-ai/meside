import { Box } from "@mantine/core";
import { warehouseService } from "../../../services/warehouse";
import { SqlCodeBlock } from "./sql-code-block";
import { TableVirtualView } from "./table-virtual-view";

type PageProps = {
  params: Promise<{ query_id: string }>;
};

export default async function WarehouseQueryPage({ params }: PageProps) {
  const { query_id: queryId } = await params;
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
        width: "100vw",
        height: "100vh",
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
