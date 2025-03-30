"use client";

import type { ReactNode } from "react";

interface ChannelLayoutProps {
  children: ReactNode;
}

export default function ChannelLayout({ children }: ChannelLayoutProps) {
  return <>{children}</>;
}
