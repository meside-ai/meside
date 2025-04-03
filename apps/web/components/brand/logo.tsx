import { Title } from "@mantine/core";

export const Logo = ({
  fontSize = 24,
  icon = false,
}: { fontSize?: number; icon?: boolean }) => {
  return (
    <Title
      order={1}
      mb="md"
      style={{
        fontFamily: "Assistant",
        fontOpticalSizing: "auto",
        fontWeight: 600,
        fontStyle: "normal",
        color: "#000",
        letterSpacing: "0px",
        textAlign: "center",
        fontSize: fontSize,
        padding: 0,
        margin: 0,
      }}
    >
      {icon ? "m" : "meside"}
    </Title>
  );
};
