import { Title } from "@mantine/core";

export const Logo = ({
  fontSize = 24,
  icon = false,
}: { fontSize?: number; icon?: boolean }) => {
  return (
    <Title
      order={1}
      style={{
        fontFamily: "var(--font-assistant)",
        fontOpticalSizing: "auto",
        fontWeight: 600,
        fontStyle: "normal",
        color: "#000",
        letterSpacing: "0px",
        fontSize: fontSize,
        padding: 0,
        margin: 0,
      }}
    >
      {icon ? "M" : "meside"}
    </Title>
  );
};
