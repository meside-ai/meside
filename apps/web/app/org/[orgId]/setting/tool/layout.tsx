"use client";

import { Box, Button, NavLink } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getToolList } from "../../../../../queries/tool";

export default function ToolLayout({
  children,
}: { children: React.ReactNode }) {
  const { data } = useQuery(getToolList({}));
  const tools = data?.tools;

  return (
    <Box>
      <Box p="md">
        <Box>
          {tools?.map((tool) => (
            <NavLink
              key={tool.toolId}
              component={Link}
              href={`tool/${tool.toolId}`}
              label={tool.name}
              variant="filled"
            />
          ))}
        </Box>
        <Box>
          <Button component={Link} href="tool/create">
            Add tool
          </Button>
        </Box>
      </Box>

      <Box>{children}</Box>
    </Box>
  );
}
