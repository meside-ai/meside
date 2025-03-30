import { Box, Button, Group, Paper, Stack, Text } from "@mantine/core";
import type { TeamDto } from "@meside/shared/api/team.schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTeamList } from "../../queries/team";
import { Logo } from "../brand/logo";

export function ChannelSidebar() {
  const params = useParams();
  const orgId = params.orgId as string;
  const channelId = params.channelId as string;

  const { data } = useQuery(getTeamList({}));
  const teams = data?.teams || [];

  return (
    <Box
      w={250}
      h="100%"
      style={{
        overflow: "hidden",
        background: "rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 0",
      }}
    >
      <Stack gap="lg" px="md">
        <Logo />
        <Text fw={700} size="sm" c="dimmed" mt="md">
          AI TEAMS
        </Text>

        {/* Channel list */}
        <Stack gap="xs">
          {teams.map((team: TeamDto) => (
            <Button
              key={team.teamId}
              component={Link}
              href={`/org/${orgId}/channel/${team.teamId}`}
              variant={team.teamId === channelId ? "light" : "subtle"}
              color={team.teamId === channelId ? "blue" : "gray"}
              fullWidth
              justify="start"
              radius="md"
              size="md"
              leftSection={
                <Box
                  w={24}
                  display="flex"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text>💬</Text>
                </Box>
              }
            >
              {team.name}
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* User profile section */}
      <Box px="md">
        <Paper p="xs" radius="md" withBorder style={{ cursor: "pointer" }}>
          <Group justify="space-between">
            <Group gap="xs">
              <Box
                w={32}
                h={32}
                style={{
                  borderRadius: "50%",
                  background: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text size="sm">JD</Text>
              </Box>
              <Text size="sm">John Doe</Text>
            </Group>
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              p={0}
              style={{ width: 24, height: 24 }}
            >
              ⚙️
            </Button>
          </Group>
        </Paper>
      </Box>
    </Box>
  );
}
