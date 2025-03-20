"use client";

import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Chat } from "../../components/chat";
import { queryClient } from "../../utils/query-client";

export default function ChatPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Notifications />
      <Chat />
    </QueryClientProvider>
  );
}
