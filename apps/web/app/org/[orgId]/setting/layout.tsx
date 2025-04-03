"use client";

import { Box, NavLink } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import AuthGuard from "../../../component/auth-guard";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgId } = useParams<{ orgId: string }>();
  const pathname = usePathname();

  const sidebarItems = useMemo(
    () => [
      {
        title: "Profile",
        href: `/org/${orgId}/setting`,
        icon: IconSettings,
      },
      {
        title: "AI Providers",
        href: `/org/${orgId}/setting/llm`,
        icon: IconSettings,
      },
      {
        title: "Warehouses",
        href: `/org/${orgId}/setting/warehouse`,
        icon: IconSettings,
      },
    ],
    [orgId],
  );

  return (
    <AuthGuard>
      <Box>
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: "none" }}
          >
            <NavLink
              label={item.title}
              leftSection={<item.icon size="1.2rem" stroke={1.5} />}
              active={pathname === item.href}
              variant="filled"
            />
          </Link>
        ))}
      </Box>
      <Box>{children}</Box>
    </AuthGuard>
  );
}
