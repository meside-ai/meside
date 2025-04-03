import { notifications } from "@mantine/notifications";

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export function setupErrorHandlers() {
  if (typeof window === "undefined") return;

  // Handle uncaught exceptions
  window.addEventListener("error", (event) => {
    console.error("Uncaught error:", event.error);

    const message = getErrorMessage(event.error) || "An unknown error occurred";

    notifications.show({
      title: "Error",
      message,
      color: "red",
      position: "top-center",
    });

    // Prevent default browser error handling
    event.preventDefault();
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled rejection:", event.reason);

    const message =
      getErrorMessage(event.reason) || "A promise rejection was not handled";

    notifications.show({
      title: "Error",
      message,
      color: "red",
      position: "top-center",
    });

    // Prevent default browser error handling
    event.preventDefault();
  });

  console.log("Global error handlers set up");
}
