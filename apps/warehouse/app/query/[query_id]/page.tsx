import { warehouseService } from "../../../services/warehouse";
import { TableVirtualView } from "./table-virtual-view";
import "./page.module.css";

export default async function WarehouseQueryPage({
  params,
}: {
  params: { query_id: string };
}) {
  const queryId = params.query_id;
  console.log(queryId);
  const query = await warehouseService.getQuery(queryId);
  const result = await warehouseService.runQueryByWarehouseId(
    query.warehouseId,
    query.sql,
  );

  return <TableVirtualView rows={result.rows} columns={result.fields} />;
}
