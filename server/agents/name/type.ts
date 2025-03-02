import { z } from "zod";

export const systemNameMessageStructure = z.object({
  type: z.literal("systemName"),
  threadId: z.string(),
  minLength: z.number().optional().default(3),
  maxLength: z.number().optional().default(20),
});

export type SystemNameMessageStructure = z.infer<
  typeof systemNameMessageStructure
>;

export const assistantNameMessageStructure = z.object({
  type: z.literal("assistantName"),
  threadId: z.string(),
  name: z.string(),
});

export type AssistantNameMessageStructure = z.infer<
  typeof assistantNameMessageStructure
>;
