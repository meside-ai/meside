"use client";

import { ThreadProvider } from "../../../../../components/thread-context/provider";
import { ThreadLoad } from "../../../../../components/thread/thread-load";

export default function ChatPage() {
  return (
    <ThreadProvider>
      <ThreadLoad />
    </ThreadProvider>
  );
}
