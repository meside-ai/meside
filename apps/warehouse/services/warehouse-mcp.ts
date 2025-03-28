import { warehouseService } from "./warehouse";

export type WarehouseMcpResponse = {
  content: {
    type: "text";
    text: string;
    description?: string;
  }[];
  isError?: boolean;
};

class WarehouseMcpService {
  // Tool to list all configured warehouses
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  async getWarehouses(payload: {}): Promise<WarehouseMcpResponse> {
    try {
      const warehouses = await warehouseService.getWarehouses();
      const content: {
        type: "text";
        text: string;
      }[] = warehouses.map((warehouse) => ({
        type: "text",
        text: [
          `warehouse name: ${warehouse.name}`,
          `warehouse type: ${warehouse.type}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }));

      return {
        content,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting warehouses: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getAllColumns(payload: {
    warehouseName: string;
  }): Promise<WarehouseMcpResponse> {
    const catalogs = await warehouseService.getCatalogs(payload.warehouseName);
    console.log("catalogs", catalogs);
    return {
      content: [
        {
          type: "text",
          text: catalogs,
        },
      ],
    };
  }

  async getTables(payload: {
    warehouseName: string;
  }): Promise<WarehouseMcpResponse> {
    try {
      const tables = await warehouseService.getTables(payload.warehouseName);
      const content: {
        type: "text";
        text: string;
      }[] = tables.map((table) => ({
        type: "text",
        text: [`table name: ${table.schemaName}.${table.tableName}`]
          .filter(Boolean)
          .join("\n"),
      }));

      return {
        content,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting tables: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async getColumns(payload: {
    warehouseName: string;
    tableName: string;
  }): Promise<WarehouseMcpResponse> {
    try {
      const columns = await warehouseService.getColumns(
        payload.warehouseName,
        payload.tableName,
      );
      const content: {
        type: "text";
        text: string;
      }[] = columns.map((column) => ({
        type: "text",
        text: [
          `column name: ${column.columnName}`,
          `column type: ${column.columnType}`,
          column.foreign ? `foreign: ${column.foreign}` : null,
          column.description ? `description: ${column.description}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }));
      return {
        content,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting columns: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async query(payload: {
    warehouseName: string;
    sql: string;
  }): Promise<WarehouseMcpResponse> {
    try {
      const results = await warehouseService.runQuery(
        payload.warehouseName,
        payload.sql,
      );
      return {
        content: [
          {
            type: "text",
            text: `Query URL: ${results.queryUrl}`,
            description:
              "The URL to the query results, return this url to user",
          },
          {
            type: "text",
            text: `SQL: ${payload.sql}`,
            description:
              "The SQL query that was run, dont return this sql to user",
          },
          // {
          //   type: "text",
          //   text: `Rows: ${JSON.stringify(results.rows, null, 2)}`,
          //   description:
          //     "The rows that were returned from the query, dont return this rows to user",
          // },
          {
            type: "text",
            text: `Fields: ${JSON.stringify(results.fields, null, 2)}`,
            description:
              "The fields that were returned from the query, dont return this fields to user",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error running query: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}

export const warehouseMcpService = new WarehouseMcpService();
