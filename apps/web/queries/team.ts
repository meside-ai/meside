import {
  type TeamCreateRequest,
  type TeamCreateResponse,
  type TeamDetailRequest,
  type TeamDetailResponse,
  type TeamListRequest,
  type TeamListResponse,
  type TeamUpdateRequest,
  type TeamUpdateResponse,
  teamCreateRoute,
  teamDetailRoute,
  teamListRoute,
  teamUpdateRoute,
} from "@meside/shared/api/team.schema";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";
import { createPost } from "../utils/request";

export const getTeamList = (
  params: TeamListRequest,
): UseQueryOptions<TeamListResponse> => ({
  enabled: true,
  queryKey: [getTeamList.name],
  queryFn: async () => {
    const json = await createPost<TeamListRequest, TeamListResponse>(
      `/meside/server/team${teamListRoute.path}`,
    )(params);
    return json;
  },
});

export const getTeamDetail = ({
  teamId,
}: TeamDetailRequest): UseQueryOptions<TeamDetailResponse> => ({
  enabled: !!teamId,
  queryKey: [getTeamDetail.name, teamId],
  queryFn: async () => {
    const json = await createPost<TeamDetailRequest, TeamDetailResponse>(
      `/meside/server/team${teamDetailRoute.path}`,
    )({ teamId });
    return json;
  },
});

export const getTeamCreate = (): UseMutationOptions<
  TeamCreateResponse,
  QueryClientError,
  TeamCreateRequest
> => ({
  mutationKey: [getTeamCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<TeamCreateRequest, TeamCreateResponse>(
      `/meside/server/team${teamCreateRoute.path}`,
    )(body);
    return json;
  },
});

export const getTeamUpdate = (): UseMutationOptions<
  TeamUpdateResponse,
  QueryClientError,
  TeamUpdateRequest
> => ({
  mutationKey: [getTeamUpdate.name],
  mutationFn: async (body) => {
    const json = await createPost<TeamUpdateRequest, TeamUpdateResponse>(
      `/meside/server/team${teamUpdateRoute.path}`,
    )(body);
    return json;
  },
});
