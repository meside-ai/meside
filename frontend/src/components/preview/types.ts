import { z } from "zod";

export const previewEntitySchema = z.object({
  previewId: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  payload: z.union([
    z.object({
      type: z.literal("warehouseColumn"),
      warehouseId: z.string(),
    }),
    z.object({
      type: z.literal("db"),
      questionId: z.string(),
    }),
    z.object({
      type: z.literal("echarts"),
      questionId: z.string(),
    }),
  ]),
});

export type PreviewEntity = z.infer<typeof previewEntitySchema>;
