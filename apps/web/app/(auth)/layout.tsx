import { Box, Container, Flex } from "@mantine/core";
import type { ReactNode } from "react";
import { Logo } from "../../components/brand/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Flex
      mih="100vh"
      style={{
        backgroundImage: "linear-gradient(to right, #f0f4f9, #e6f0fb)",
      }}
    >
      <Container size="md" py="xl" h="100%" style={{ flex: 1 }}>
        <Box ta="center" mb={30}>
          <Logo />
        </Box>
        {children}
      </Container>
    </Flex>
  );
}
