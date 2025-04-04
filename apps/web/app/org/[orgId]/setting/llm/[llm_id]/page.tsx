"use client";

import { Box } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getLlmDetail,
  getLlmList,
  getLlmUpdate,
} from "../../../../../../queries/llm";
import { queryClient } from "../../../../../../utils/query-client";
import { Form } from "../form";

export default function WarehouseSettingPage() {
  const { llm_id: llmId } = useParams<{ llm_id: string }>();
  const { data } = useQuery(getLlmDetail({ llmId: llmId ?? "" }));
  const llm = data?.llm;
  const { mutateAsync: updateLlm } = useMutation({
    ...getLlmUpdate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getLlmList.name] });
    },
  });

  return (
    <Box>
      <Form
        initialData={llm ? llm : undefined}
        onSubmit={async (data) => {
          llmId &&
            (await updateLlm({
              llmId,
              ...data,
            }));
        }}
      />
    </Box>
  );
}
