"use client";

import { Container } from "@mantine/core";
import type { ReactNode } from "react";
import AuthGuard from "../component/auth-guard";

interface OrgLayoutProps {
  children: ReactNode;
}

export default function OrgLayout({ children }: OrgLayoutProps) {
  return (
    <AuthGuard>
      <Container>{children}</Container>
    </AuthGuard>
  );
}
