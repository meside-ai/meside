"use client";

import { AppShellMain, Box, Button, NavLink } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getLlmList } from "../../../queries/llm";

export default function LlmLayout({ children }: { children: React.ReactNode }) {
  const { data } = useQuery(getLlmList({}));
  const llms = data?.llms;

  return (
    <Box>
      <Box p="md">
        <Box>
          {llms?.map((llm) => (
            <NavLink
              key={llm.llmId}
              component={Link}
              href={`/setting/llm/${llm.llmId}`}
              label={llm.name}
              variant="filled"
            />
          ))}
        </Box>
        <Box>
          <Button component={Link} href="/setting/llm/create">
            Add model
          </Button>
        </Box>
      </Box>

      <AppShellMain>{children}</AppShellMain>
    </Box>
  );
}
