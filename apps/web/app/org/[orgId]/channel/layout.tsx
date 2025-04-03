"use client";

import { Box } from "@mantine/core";
import type { TeamDto } from "@meside/shared/api/team.schema";
import { IconDatabase } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { AppShellWrapper } from "../../../../components/appshell/appshell-wrapper";
import { SidebarBrand } from "../../../../components/appshell/sidebar-brand";
import { SidebarMenuButton } from "../../../../components/appshell/sidebar-menu-button";
import { getTeamList } from "../../../../queries/team";

interface ChannelLayoutProps {
  children: ReactNode;
}

export default function ChannelLayout({ children }: ChannelLayoutProps) {
  const params = useParams();
  const orgId = params.orgId as string;
  const channelId = params.channelId as string;

  const { data } = useQuery(getTeamList({}));
  const teams = data?.teams || [];

  const sidebarItems = teams.map((team: TeamDto) => ({
    href: `/org/${orgId}/channel/${team.teamId}`,
    title: team.name,
    icon: IconDatabase,
  }));

  return (
    <AppShellWrapper
      sidebar={
        <Box>
          <SidebarBrand />
          {sidebarItems.map((item) => (
            <SidebarMenuButton
              key={item.href}
              href={item.href}
              active={item.href === `/org/${orgId}/channel/${channelId}`}
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
