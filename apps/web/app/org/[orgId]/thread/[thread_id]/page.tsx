"use client";

import { PreviewProvider } from "../../../../../components/preview/preview-provider";
import { ThreadProvider } from "../../../../../components/thread-context/provider";
import { ThreadLoad } from "../../../../../components/thread/thread-load";

export default function ChatPage({ params }: { params: { threadId: string } }) {
  return (
    <PreviewProvider>
      <ThreadProvider>
        <ThreadLoad />
      </ThreadProvider>
    </PreviewProvider>
  );
}
