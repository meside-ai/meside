"use client";

import { Box, Button, Code, Collapse } from "@mantine/core";
import { IconCode } from "@tabler/icons-react";
import { useState } from "react";

export function SqlCodeBlock({ sql }: { sql: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <Box mb="xs">
      <Button
        onClick={() => setOpened((o) => !o)}
        size="xs"
        variant="subtle"
        leftSection={<IconCode size={16} />}
      >
        {opened ? "Hide SQL" : "Show SQL"}
      </Button>
      <Collapse in={opened}>
        <Code block mt="xs">
          {sql}
        </Code>
      </Collapse>
    </Box>
  );
}
