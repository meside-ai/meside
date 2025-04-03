"use client";

import { Box, Group, UnstyledButton } from "@mantine/core";
import type { TeamDto } from "@meside/shared/api/team.schema";
import { IconDatabase } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "../../../../components/brand/logo";
import { getTeamList } from "../../../../queries/team";

interface ChannelLayoutProps {
  children: ReactNode;
}

export default function ChannelLayout({ children }: ChannelLayoutProps) {
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <ChannelSidebar />
      {children}
    </Box>
  );
}

function ChannelSidebar() {
  const params = useParams();
  const orgId = params.orgId as string;
  const channelId = params.channelId as string;

  const { data } = useQuery(getTeamList({}));
  const teams = data?.teams || [];

  return (
    <Box
      style={{
        width: 250,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderRight: "1px solid #e0e0e0",
      }}
    >
      <Box px="md">
        <Logo />
      </Box>
      {teams.map((team: TeamDto) => (
        <UnstyledButton
          key={team.teamId}
          component={Link}
          href={`/org/${orgId}/channel/${team.teamId}`}
          px="md"
          py="xs"
          style={{
            backgroundColor:
              team.teamId === channelId
                ? "var(--mantine-color-brown-2)"
                : "transparent",
            color:
              team.teamId === channelId
                ? "var(--mantine-color-brown-9)"
                : "gray",
          }}
        >
          <Group>
            <IconDatabase size={14} />
            {team.name}
          </Group>
        </UnstyledButton>
      ))}
    </Box>
  );
}
