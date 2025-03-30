"use client";

import type { ReactNode } from "react";

interface OrgLayoutProps {
  children: ReactNode;
}

export default function OrgLayout({ children }: OrgLayoutProps) {
  return <>{children}</>;
}
