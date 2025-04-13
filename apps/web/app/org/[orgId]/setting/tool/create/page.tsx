"use client";

import { Container, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { getToolCreate, getToolList } from "../../../../../../queries/tool";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function ToolCreatePage() {
  const { mutateAsync: createTool } = useMutation({
    ...getToolCreate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getToolList.name] });
    },
  });

  return (
    <Container py="xl">
      <Title order={2} mb="md">
        New Tool
      </Title>
      <Form
        onSubmit={async (data) => {
          await createTool(data);
        }}
      />
    </Container>
  );
}
