import { getStreamQuestionUrl } from "@/api";
import type { StreamQuestionResponse } from "@meside/api/stream.schema";
import { useCallback, useRef, useState } from "react";

export const useQuestionStream = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const stream = useCallback(
    (
      questionId: string,
      callback: (
        question: StreamQuestionResponse | null,
        done: boolean,
      ) => void,
    ) => {
      setIsLoading(true);
      setError(null);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const url = getStreamQuestionUrl(questionId);
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          try {
            if (event.data === "[DONE]") {
              // threadNameEvent.dispatch({ threadId });
              setIsLoading(false);
              eventSource.close();
              callback(null, true);
              return;
            }

            const chunk: StreamQuestionResponse = JSON.parse(event.data);
            callback(chunk, false);
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
    },
    [],
  );

  return {
    isLoading,
    error,
    stream,
  };
};
