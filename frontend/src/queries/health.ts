import { createPost } from "@/utils/request";
import {
  type HealthHeartbeatRequest,
  type HealthHeartbeatResponse,
  healthHeartbeatRoute,
} from "@meside/shared/api/health.schema";
import type { UseQueryOptions } from "@tanstack/react-query";

export const getHealthHeartbeat =
  (): UseQueryOptions<HealthHeartbeatResponse> => ({
    enabled: true,
    queryKey: [getHealthHeartbeat.name],
    queryFn: async () => {
      const json = await createPost<
        HealthHeartbeatRequest,
        HealthHeartbeatResponse
      >(`/health${healthHeartbeatRoute.path}`)({});
      return json;
    },
  });
