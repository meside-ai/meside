"use client";

import { Box } from "@mantine/core";
import AuthGuard from "../component/auth-guard";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Box>{children}</Box>
    </AuthGuard>
  );
}
