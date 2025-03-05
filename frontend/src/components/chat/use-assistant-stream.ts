import type { ChatAssistantStreamResponse } from "@/api/chat.schema";
import { useRef, useState } from "react";

export const useAssistantStream = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const stream = (
    threadId: string,
    callback: (message: ChatAssistantStreamResponse) => void,
  ) => {
    setIsLoading(true);
    setError(null);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const url = `/aidw/api/chat/assistant-stream?parentThreadId=${threadId}`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const chunk: ChatAssistantStreamResponse = JSON.parse(event.data);
          callback(chunk);
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      };

      eventSource.onerror = (e) => {
        console.error("EventSource error:", e);
        setError(new Error("Failed to connect to message stream"));
        setIsLoading(false);
        eventSource.close();
      };

      eventSource.onopen = () => {
        setIsLoading(false);
      };
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error occurred"));
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    stream,
  };
};
