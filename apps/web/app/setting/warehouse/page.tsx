"use client";

import { Box } from "@mantine/core";

export default function WarehouseSettingsPage() {
  return (
    <Box style={{ width: "100%", height: 500 }}>
      <iframe
        src="http://localhost:3002/meside/warehouse/setting"
        title="Warehouse Settings"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </Box>
  );
}
