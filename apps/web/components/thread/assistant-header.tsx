import { Box, Text } from "@mantine/core";

export const AssistantHeader = () => {
  return (
    <Box>
      <Box
        display="inline-flex"
        style={(theme) => ({
          alignItems: "center",
          gap: 12,
          border: `1px solid ${theme.colors.gray[3]}`,
          padding: 4,
          paddingLeft: 12,
          paddingRight: 12,
          borderRadius: 30,
        })}
        mb="md"
      >
        <Text>Meside</Text>
      </Box>
    </Box>
  );
};
