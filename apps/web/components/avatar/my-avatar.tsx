"use client";

import { Avatar, type AvatarProps, Menu, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getMe } from "../../queries/auth";
import { clearAuthTokens } from "../../utils/auth-storage";

export type MyAvatarProps = Omit<AvatarProps, "children">;

export function MyAvatar(props: MyAvatarProps) {
  const router = useRouter();
  const { data, isLoading } = useQuery(getMe({}));

  const initials = useMemo(() => {
    if (!data?.user.name) return "?";

    const nameParts = data.user.name.split(" ").filter(Boolean);
    if (nameParts.length === 0) return "?";

    if (nameParts.length === 1) {
      // Single word name, take first letter
      return nameParts[0]?.charAt(0).toUpperCase() || "";
    }

    // Multiple word name, take first letter of first and last parts
    const firstName = nameParts[0] || "";
    const lastName = nameParts[nameParts.length - 1] || "";

    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  }, [data?.user.name]);

  if (isLoading) {
    return <Avatar {...props} />;
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar src={data?.user.avatar || undefined} {...props}>
          {initials}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text>{data?.user.name}</Text>
        </Menu.Label>
        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={() => {
            clearAuthTokens();
            router.push("/login");
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
