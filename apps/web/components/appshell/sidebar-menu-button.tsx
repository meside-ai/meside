import { Group } from "@mantine/core";

import { UnstyledButton } from "@mantine/core";
import Link from "next/link";

export function SidebarMenuButton({
  href,
  active,
  title,
  icon,
}: { href: string; active: boolean; title: string; icon?: React.ReactNode }) {
  return (
    <UnstyledButton
      component={Link}
      href={href}
      px="md"
      py="xs"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: active
          ? "var(--mantine-color-brown-2)"
          : "transparent",
        color: active ? "var(--mantine-color-brown-9)" : "gray",
      }}
    >
      <Group>
        {icon}
        {title}
      </Group>
    </UnstyledButton>
  );
}
