"use client";

import { redirect } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { isAuthenticated } from "../../utils/auth-storage";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const checkAuth = () => {
    if (!isAuthenticated()) {
      redirect("/login");
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    checkAuth();
  }, []);

  checkAuth();

  return <>{children}</>;
}
