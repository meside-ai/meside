"use client";

import { Box } from "@mantine/core";
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
    <Box>
      <Form
        onSubmit={async (data) => {
          await createLlm(data);
        }}
      />
    </Box>
  );
}
