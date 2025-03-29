import type { ZodRawShape, ZodSchema } from "zod";

export type McpToolSet<T = ZodRawShape> = {
  name: string;
  description: string;
  schema: ZodSchema<T>;
  execute: (payload: T) => Promise<{
    content: (
      | {
          type: "text";
          text: string;
        }
      | {
          type: "image";
          data: string;
          mimeType: string;
        }
      | {
          type: "audio";
          data: string;
          mimeType: string;
        }
    )[];
    isError?: boolean;
  }>;
};

export const mcpToolSet = <T = Record<string, unknown>>(
  toolSet: McpToolSet<T>,
): McpToolSet<T> => {
  return toolSet;
};
