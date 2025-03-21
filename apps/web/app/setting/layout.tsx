"use client";

import { AppShell, NavLink } from "@mantine/core";
import {
  IconDatabase,
  IconRobot,
  IconSettings,
  IconTools,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Profile",
    href: "/setting",
    icon: IconSettings,
  },
  {
    title: "Model Setting",
    href: "/setting/model",
    icon: IconDatabase,
  },
  {
    title: "Agent Setting",
    href: "/setting/agent",
    icon: IconRobot,
  },
  {
    title: "Tool Setting",
    href: "/setting/tools",
    icon: IconTools,
  },
];

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
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
  );
}
