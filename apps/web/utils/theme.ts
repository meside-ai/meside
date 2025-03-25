import { createTheme } from "@mantine/core";

export const getTheme = () =>
  createTheme({
    defaultRadius: "md",
    primaryColor: "brown",
    colors: {
      brown: [
        "#f7f3f2",
        "#e8e6e5",
        "#d2c9c6",
        "#bdaaa4",
        "#ab9087",
        "#a17f74",
        "#9d766a",
        "#896459",
        "#7b594e",
        "#6d4b40",
      ],
      gray: [
        "#ffffff",
        "#f5f5f5",
        "#e5e5e5",
        "#d4d4d4",
        "#a3a3a3",
        "#737373",
        "#525252",
        "#404040",
        "#262626",
        "#171717",
        "#000000",
      ],
    },
  });
