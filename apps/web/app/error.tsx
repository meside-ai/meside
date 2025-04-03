"use client";

import { Button } from "@mantine/core";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error);

    // You could add additional error reporting here
    // Example: sendToErrorReportingService(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4 text-red-500">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button onClick={reset} variant="filled" color="blue">
        Try again
      </Button>
    </div>
  );
}
