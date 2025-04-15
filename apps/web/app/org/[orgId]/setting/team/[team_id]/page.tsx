"use client";

import { Container, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  getTeamDetail,
  getTeamList,
  getTeamUpdate,
} from "../../../../../../queries/team";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function TeamDetailPage() {
  const { team_id: teamId } = useParams<{ team_id: string }>();
  const router = useRouter();
  const { orgId } = useParams<{ orgId: string }>();
  const { data } = useQuery(getTeamDetail({ teamId: teamId ?? "" }));
  const team = useMemo(() => {
    if (!data?.team) return undefined;
    return {
      name: data.team.name,
      description: data.team.description,
      orchestration: data.team.orchestration,
    };
  }, [data]);

  const { mutateAsync: updateTeam } = useMutation({
    ...getTeamUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTeamList.name] });
      router.push(`/org/${orgId}/setting/team`);
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
