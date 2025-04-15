"use client";

import { Container, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  getToolDetail,
  getToolList,
  getToolUpdate,
} from "../../../../../../queries/tool";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function ToolDetailPage() {
  const { tool_id: toolId } = useParams<{ tool_id: string }>();
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { data } = useQuery(getToolDetail({ toolId: toolId ?? "" }));
  const tool = data?.tool;
  const { mutateAsync: updateTool } = useMutation({
    ...getToolUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getToolList.name] });
      router.push(`/org/${orgId}/setting/tool`);
    },
  });

  return (
    <Container py="xl">
      <Title order={2} mb="md">
        Edit Tool
      </Title>
      <Form
        initialData={tool ? tool : undefined}
        onSubmit={async (data) => {
          toolId &&
            (await updateTool({
              toolId,
              ...data,
            }));
        }}
      />
    </Container>
  );
}
