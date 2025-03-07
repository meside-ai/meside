import { healthApi } from "@/api";
import type { HealthHeartbeatResponse } from "@meside/api/health.schema";
import type { UseQueryOptions } from "@tanstack/react-query";

export const getHealthHeartbeat =
  (): UseQueryOptions<HealthHeartbeatResponse> => ({
    enabled: true,
    queryKey: [getHealthHeartbeat.name],
    queryFn: async () => {
      const res = await healthApi.heartbeat.$post({
        json: {},
      });
      const json = await res.json();
      return json;
    },
  });
