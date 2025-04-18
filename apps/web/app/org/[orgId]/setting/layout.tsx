"use client";

import { Box } from "@mantine/core";
import {
  IconDatabase,
  IconGrain,
  IconPick,
  IconPlayHandball,
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
        title: "AI Teams",
        href: `/org/${orgId}/setting/team`,
        icon: IconPlayHandball,
      },
      {
        title: "AI Models",
        href: `/org/${orgId}/setting/llm`,
        icon: IconGrain,
      },
      {
        title: "AI Tools",
        href: `/org/${orgId}/setting/tool`,
        icon: IconPick,
      },
      {
        title: "Databases",
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
