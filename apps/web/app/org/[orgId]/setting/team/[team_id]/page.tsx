"use client";

import { Container, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getTeamDetail,
  getTeamList,
  getTeamUpdate,
} from "../../../../../../queries/team";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function TeamDetailPage() {
  const { team_id: teamId } = useParams<{ team_id: string }>();
  const { data } = useQuery(getTeamDetail({ teamId: teamId ?? "" }));
  const team = data?.team;
  const { mutateAsync: updateTeam } = useMutation({
    ...getTeamUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTeamList.name] });
    },
  });

  return (
    <Container py="xl">
      <Title order={2} mb="md">
        Edit Team
      </Title>
      <Form
        initialData={team ? team : undefined}
        onSubmit={async (data) => {
          teamId &&
            (await updateTeam({
              teamId,
              ...data,
            }));
        }}
      />
    </Container>
  );
}
