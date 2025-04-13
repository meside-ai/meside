"use client";

import { Container, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { getLlmCreate, getLlmList } from "../../../../../../queries/llm";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function LlmSettingPage() {
  const { mutateAsync: createLlm } = useMutation({
    ...getLlmCreate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getLlmList.name] });
    },
  });

  return (
    <Container py="xl">
      <Title order={2} mb="md">
        New AI model
      </Title>
      <Form
        onSubmit={async (data) => {
          await createLlm(data);
        }}
      />
    </Container>
  );
}
