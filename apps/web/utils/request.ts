export const getOptions = () => {
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
