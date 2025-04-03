import { Box } from "@mantine/core";

export function AppShellWrapper({
  sidebar,
  children,
}: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          width: 250,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderRight: "1px solid #e0e0e0",
        }}
      >
        {sidebar}
      </Box>
      <Box
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
