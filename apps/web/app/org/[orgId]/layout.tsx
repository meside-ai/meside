"use client";

import { Box } from "@mantine/core";
import type { ReactNode } from "react";
import { SIDEBAR_WIDTH } from "../../sidebar-width.constant";
import Sidebar from "./sidebar";

interface OrgLayoutProps {
  children: ReactNode;
}

export default function OrgLayout({ children }: OrgLayoutProps) {
  return (
    <>
      <Box
        component="nav"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
          justifyContent: "space-between",
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
        <Sidebar />
      </Box>
      {children}
    </>
  );
}
