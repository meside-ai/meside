import {
  type WarehouseMcpResponse,
  warehouseMcpService,
} from "../../../services/warehouse-mcp";

export async function POST(req: Request) {
  const json = await req.json();
  const { action, payload } = json;

  let response: WarehouseMcpResponse | null = null;

  switch (action) {
    case "get-warehouses":
      response = await warehouseMcpService.getWarehouses(payload);
      break;
    case "get-all-columns":
      response = await warehouseMcpService.getAllColumns(payload);
      break;
    case "get-tables":
      response = await warehouseMcpService.getTables(payload);
      break;
    case "get-columns":
      response = await warehouseMcpService.getColumns(payload);
      break;
    case "query":
      response = await warehouseMcpService.query(payload);
      break;
    default:
      response = {
        content: [{ type: "text", text: "Invalid action" }],
        isError: true,
      };
      break;
  }

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
    status: response?.isError ? 400 : 200,
  });
}
