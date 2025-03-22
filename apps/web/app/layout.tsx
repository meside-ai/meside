import type { Metadata } from "next";
import localFont from "next/font/local";
import { getTheme } from "../utils/theme";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { Notification } from "./component/notification";
import QueryProvider from "./component/query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Meside Analysis",
  description: "Meside AI Agent and MCP for Data Analysis",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <MantineProvider theme={getTheme()}>
            <Notification />
            {children}
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
