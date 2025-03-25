"use client";

import { AppShell, NavLink } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { IconSettings } from "@tabler/icons-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { queryClient } from "../../utils/query-client";

const sidebarItems = [
  {
    title: "Profile",
    href: "/setting",
    icon: IconSettings,
  },
  {
    title: "AI Providers",
    href: "/setting/llm",
    icon: IconSettings,
  },
  {
    title: "Warehouses",
    href: "/setting/warehouse",
    icon: IconSettings,
  },
];

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Notifications />
      <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding="md">
        <AppShell.Navbar p="md">
          <AppShell.Section grow>
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
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  );
}
