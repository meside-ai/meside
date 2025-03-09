import { z } from "zod";

export const previewEntitySchema = z.object({
  previewId: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  payload: z.union([
    z.object({
      type: z.literal("previewWarehouse"),
      warehouseId: z.string(),
    }),
    z.object({
      type: z.literal("previewSql"),
      questionId: z.string(),
    }),
    z.object({
      type: z.literal("previewEcharts"),
      questionId: z.string(),
    }),
  ]),
});

export type PreviewEntity = z.infer<typeof previewEntitySchema>;
