"use client";
// Error handler initializer component

import { useEffect } from "react";
import { setupErrorHandlers } from "../../utils/error-handler";

export default function ErrorHandlerInitializer() {
  useEffect(() => {
    setupErrorHandlers();
  }, []);

  // This component doesn't render anything
  return null;
}
