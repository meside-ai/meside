import { z } from "zod";

export const systemContentMessageStructure = z.object({
  type: z.literal("systemContent"),
  content: z.string(),
});

export type SystemContentMessageStructure = z.infer<
  typeof systemContentMessageStructure
>;

export const userContentMessageStructure = z.object({
  type: z.literal("userContent"),
  content: z.string(),
});

export type UserContentMessageStructure = z.infer<
  typeof userContentMessageStructure
>;

export const assistantContentMessageStructure = z.object({
  type: z.literal("assistantContent"),
  content: z.string(),
});

export type AssistantContentMessageStructure = z.infer<
  typeof assistantContentMessageStructure
>;
