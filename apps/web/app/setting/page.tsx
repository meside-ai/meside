import { Avatar, Container, Paper, Stack, Text, Title } from "@mantine/core";

export default function SettingsPage() {
  // TODO: Replace with actual user data from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/1234567",
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Title order={4}>Profile Information</Title>
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                size="xl"
                radius="xl"
              />
              <div>
                <Text fw={500} size="lg">
                  {user.name}
                </Text>
                <Text c="dimmed" size="sm">
                  {user.email}
                </Text>
              </div>
            </div>
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Title order={4}>General Settings</Title>
            <Text size="sm" c="dimmed">
              Manage your general application settings
            </Text>
            {/* Add your settings controls here */}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
