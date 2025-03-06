import { getStreamAssistantUrl } from "@/api";
import type { StreamAssistantResponse } from "@/api/stream.schema";
import { useRef, useState } from "react";
import { threadNameEvent } from "./thread-name-event";

export const useAssistantStream = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const stream = (
    threadId: string,
    callback: (message: StreamAssistantResponse) => void,
  ) => {
    setIsLoading(true);
    setError(null);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const url = getStreamAssistantUrl(threadId);
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          if (event.data === "[DONE]") {
            threadNameEvent.dispatch({ threadId });
            setIsLoading(false);
            eventSource.close();
            return;
          }

          const chunk: StreamAssistantResponse = JSON.parse(event.data);
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
