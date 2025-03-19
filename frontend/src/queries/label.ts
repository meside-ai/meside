import type { QueryClientError } from "@/utils/query-client";
import { createPost } from "@/utils/request";
import {
  type LabelLoadRequest,
  type LabelLoadResponse,
  labelLoadRoute,
} from "@meside/shared/api/label.schema";
import type { UseMutationOptions } from "@tanstack/react-query";

export type { LabelDto } from "@meside/shared/api/label.schema";

export const getLabelLoad = (): UseMutationOptions<
  LabelLoadResponse,
  QueryClientError,
  LabelLoadRequest
> => ({
  mutationKey: [getLabelLoad.name],
  mutationFn: async ({ warehouseId }) => {
    const json = await createPost<LabelLoadRequest, LabelLoadResponse>(
      `/label${labelLoadRoute.path}`,
    )({ warehouseId });
    return json;
  },
});
