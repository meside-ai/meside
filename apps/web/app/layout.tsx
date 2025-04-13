import type { Metadata } from "next";
import localFont from "next/font/local";
import { getTheme } from "../utils/theme";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import ErrorHandlerInitializer from "./component/error-handler-initializer";
import { Notification } from "./component/notification";
import QueryProvider from "./component/query-provider";

const assistantFont = localFont({
  src: "./fonts/Assistant-VariableFont_wght.ttf",
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "Meside AI",
  description: "Meside AI Agent and MCP tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${assistantFont.variable}`}>
        <QueryProvider>
          <MantineProvider theme={getTheme()}>
            <Notification />
            <ErrorHandlerInitializer />
            {children}
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
