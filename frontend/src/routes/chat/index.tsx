import { Chat } from "@/components/chat";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ChatSearchSchema = z.object({
  thread: z.string().optional(),
});

export const Route = createFileRoute("/chat/")({
  validateSearch: (search) => ChatSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
