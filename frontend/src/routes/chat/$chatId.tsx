import { Chat } from "@/components/chat";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ChatSearchSchema = z.object({
  preview: z.string().optional().catch(""),
});

export const Route = createFileRoute("/chat/$chatId")({
  validateSearch: (search) => ChatSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
