import {
  type RefreshTokenResponse,
  refreshTokenRoute,
} from "@meside/shared/api/auth.schema";
import { getAuthToken, getRefreshToken, setAuthTokens } from "./auth-storage";

const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(
      `/meside/server/auth${refreshTokenRoute.path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (response.ok) {
      const data: RefreshTokenResponse = await response.json();
      setAuthTokens(data.token, data.refreshToken);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

const getOrgId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const pathname = window.location.pathname;
  const match = pathname.match(/^\/org\/([^/]+)/);
  const orgId = match ? match[1] : null;
  return orgId ?? null;
};

export const getOptions = () => {
  return {
    fetch: async (
      url: Parameters<typeof fetch>[0],
      options: Parameters<typeof fetch>[1],
    ) => {
      const token = getAuthToken();
      const orgId = getOrgId();
      const headers = {
        ...(options?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(orgId ? { "X-Org-Id": orgId } : {}),
      };

      const updatedOptions = {
        ...options,
        headers,
      };

      let response = await fetch(url, updatedOptions);

      // Handle token expiration (401 Unauthorized)
      if (response.status === 401) {
        const newToken = await refreshAuthToken();
        if (newToken) {
          // Update headers with new token
          const refreshedHeaders = {
            ...(options?.headers || {}),
            ...(orgId ? { "X-Org-Id": orgId } : {}),
            Authorization: `Bearer ${newToken}`,
          };

          // Retry the request with new token
          response = await fetch(url, {
            ...options,
            headers: refreshedHeaders,
          });
        }
      }

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

export const createPost = <PostRequest, PostResponse>(
  url: string,
  options?: {
    baseUrl: string;
  },
) => {
  const baseUrl = options?.baseUrl ?? "";
  const defaultOptions = getOptions();
  const fetch = defaultOptions.fetch;

  return async (request: PostRequest): Promise<PostResponse> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: request ? JSON.stringify(request) : undefined,
    });
    return await response.json();
  };
};
