"use client";

import { ThreadProvider } from "../../../../../components/thread-context/provider";
import { ThreadLoad } from "../../../../../components/thread/thread-load";

export default function ChatPage({ params }: { params: { threadId: string } }) {
  return (
    <ThreadProvider>
      <ThreadLoad />
    </ThreadProvider>
  );
}
