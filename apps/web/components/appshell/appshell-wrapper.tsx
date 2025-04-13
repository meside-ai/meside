import { Box } from "@mantine/core";
import { MENUBAR_WIDTH, SIDEBAR_WIDTH } from "../../app/sidebar-width.constant";

export function AppShellWrapper({
  sidebar,
  children,
}: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box
      style={{
        paddingLeft: SIDEBAR_WIDTH + MENUBAR_WIDTH,
      }}
    >
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: SIDEBAR_WIDTH,
          width: MENUBAR_WIDTH,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderRight: "1px solid #e0e0e0",
        }}
      >
        {sidebar}
      </Box>
      {children}
    </Box>
  );
}
