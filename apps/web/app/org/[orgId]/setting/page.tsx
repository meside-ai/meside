import { Container, Paper, Title } from "@mantine/core";

export default function SettingsPage() {
  // TODO: Replace with actual user data from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/1234567",
  };

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="md" radius="md">
        <Title order={4}>Organization Information</Title>
      </Paper>
    </Container>
  );
}
