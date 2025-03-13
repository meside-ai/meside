import { labelApi } from "@/api";
import type { QueryClientError } from "@/utils/query-client";
import type { LabelLoadResponse } from "@meside/api/label.schema";
import type { LabelLoadRequest } from "@meside/api/label.schema";
import type { UseMutationOptions } from "@tanstack/react-query";

export type { CatalogDto } from "@meside/api/catalog.schema";

export const getLabelLoad = (): UseMutationOptions<
  LabelLoadResponse,
  QueryClientError,
  LabelLoadRequest
> => ({
  mutationKey: [getLabelLoad.name],
  mutationFn: async ({ warehouseId }) => {
    const response = await labelApi.load.$post({
      json: {
        warehouseId,
      },
    });
    const json = await response.json();
    return json;
  },
});
