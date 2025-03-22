import { notifications } from "@mantine/notifications";
import { QueryClient } from "@tanstack/react-query";

export type QueryClientError = { error: string };

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        let message = "An error occurred";

        if (error instanceof Error) {
          message = error.message;
        }

        if ("error" in error) {
          message = (error as QueryClientError).error;
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
});
