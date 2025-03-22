import { MantineProvider } from "@mantine/core";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { getTheme } from "../utils/theme";
import QueryProvider from "./component/query-provider";
import "@mantine/core/styles.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Meside Warehouse MCP Server",
  description: "Meside Warehouse MCP Server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <MantineProvider theme={getTheme()}>{children}</MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
