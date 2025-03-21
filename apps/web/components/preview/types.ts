import { z } from "zod";

export const previewEntitySchema = z.object({
  previewId: z.string(),
  name: z.string(),
  type: z.enum(["warehouse", "preview"]),
  value: z.string(),
});

export type PreviewEntity = z.infer<typeof previewEntitySchema>;
