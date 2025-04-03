"use client";

import { Box } from "@mantine/core";
import {
  IconDatabase,
  IconRobot,
  IconSitemap,
  IconTool,
} from "@tabler/icons-react";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { AppShellWrapper } from "../../../../components/appshell/appshell-wrapper";
import { SidebarBrand } from "../../../../components/appshell/sidebar-brand";
import { SidebarMenuButton } from "../../../../components/appshell/sidebar-menu-button";

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
        title: "Organization",
        href: `/org/${orgId}/setting`,
        icon: IconSitemap,
      },
      {
        title: "AI Providers",
        href: `/org/${orgId}/setting/llm`,
        icon: IconRobot,
      },
      {
        title: "Tools",
        href: `/org/${orgId}/setting/tool`,
        icon: IconTool,
      },
      {
        title: "Warehouses",
        href: `/org/${orgId}/setting/warehouse`,
        icon: IconDatabase,
      },
    ],
    [orgId],
  );

  return (
    <AppShellWrapper
      sidebar={
        <Box>
          <SidebarBrand />
          {sidebarItems.map((item) => (
            <SidebarMenuButton
              key={item.href}
              href={item.href}
              active={pathname === item.href}
              title={item.title}
              icon={<item.icon size={16} />}
            />
          ))}
        </Box>
      }
    >
      {children}
    </AppShellWrapper>
  );
}
