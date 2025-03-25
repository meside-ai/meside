"use client";

import { notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error) => {
              let message = "An error occurred";

              if (error instanceof Error) {
                message = error.message;
              }

              if ("error" in error && typeof error.error === "string") {
                message = error.error;
              }

              notifications.show({
                title: "Error",
                message: message,
                color: "red",
                position: "top-center",
              });
            },
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );
}
