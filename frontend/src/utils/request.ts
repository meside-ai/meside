import { type ClientRequestOptions, hc } from "hono/client";
import type { HonoBase } from "hono/hono-base";

export const getOptions = (): ClientRequestOptions => {
  return {
    fetch: async (
      url: Parameters<typeof fetch>[0],
      options: Parameters<typeof fetch>[1],
    ) => {
      const response = await fetch(url, options);
      if (response.status >= 200 && response.status < 400) {
        return response;
      }
      let message = "Unknown error";
      try {
        const error = await response.json();
        if (error.error.name === "ZodError") {
          message = "bad request error"; // TODO: display details of zod error
        } else if (error.error) {
          message = error?.error;
        }
      } catch (error) {
        console.error("error", error);
        message = "Failed to fetch";
      }

      throw new Error(message);
    },
  };
};

export const api = <T extends HonoBase<any, any, any>>(
  url: string,
  options?: {
    baseUrl: string;
  },
) => {
  const baseUrl = options?.baseUrl ?? "/meside/api";
  const defaultOptions = getOptions();
  return hc<T>(`${baseUrl}${url}`, defaultOptions);
};
