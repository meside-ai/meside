import { Box, Button, Group } from "@mantine/core";
import { Collapse as BaseCollapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export type CollapseProps = {
  defaultOpened?: boolean;
  children: React.ReactNode;
};

export const CollapseCard = ({ defaultOpened, children }: CollapseProps) => {
  const [opened, { toggle }] = useDisclosure(defaultOpened ?? false);

  return (
    <Box>
      <Group justify="center" mb={5}>
        <Button onClick={toggle} variant="white">
          {opened ? "Hide" : "Show"}
        </Button>
      </Group>

      <BaseCollapse in={opened}>{children}</BaseCollapse>
    </Box>
  );
};
