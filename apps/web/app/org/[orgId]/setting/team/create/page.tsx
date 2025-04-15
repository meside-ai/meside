"use client";

import { Container, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { getTeamCreate, getTeamList } from "../../../../../../queries/team";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function TeamCreatePage() {
  const { mutateAsync: createTeam } = useMutation({
    ...getTeamCreate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTeamList.name] });
    },
  });

  return (
    <Container py="xl">
      <Title order={2} mb="md">
        New Team
      </Title>
      <Form
        onSubmit={async (data) => {
          await createTeam(data);
        }}
      />
    </Container>
  );
}
