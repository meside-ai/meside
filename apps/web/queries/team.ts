import {
  type TeamAgentAssignRequest,
  type TeamAgentAssignResponse,
  type TeamAgentListRequest,
  type TeamAgentListResponse,
  type TeamAgentUnassignRequest,
  type TeamAgentUnassignResponse,
  type TeamCreateRequest,
  type TeamCreateResponse,
  type TeamDetailRequest,
  type TeamDetailResponse,
  type TeamListRequest,
  type TeamListResponse,
  type TeamUpdateRequest,
  type TeamUpdateResponse,
  teamAgentAssignRoute,
  teamAgentListRoute,
  teamAgentUnassignRoute,
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

export const getTeamAgentAssign = (): UseMutationOptions<
  TeamAgentAssignResponse,
  QueryClientError,
  TeamAgentAssignRequest
> => ({
  mutationKey: [getTeamAgentAssign.name],
  mutationFn: async (body) => {
    const json = await createPost<
      TeamAgentAssignRequest,
      TeamAgentAssignResponse
    >(`/meside/server/team${teamAgentAssignRoute.path}`)(body);
    return json;
  },
});

export const getTeamAgentUnassign = (): UseMutationOptions<
  TeamAgentUnassignResponse,
  QueryClientError,
  TeamAgentUnassignRequest
> => ({
  mutationKey: [getTeamAgentUnassign.name],
  mutationFn: async (body) => {
    const json = await createPost<
      TeamAgentUnassignRequest,
      TeamAgentUnassignResponse
    >(`/meside/server/team${teamAgentUnassignRoute.path}`)(body);
    return json;
  },
});

export const getTeamAgentList = ({
  teamId,
}: TeamAgentListRequest): UseQueryOptions<TeamAgentListResponse> => ({
  enabled: !!teamId,
  queryKey: [getTeamAgentList.name, teamId],
  queryFn: async () => {
    const json = await createPost<TeamAgentListRequest, TeamAgentListResponse>(
      `/meside/server/team${teamAgentListRoute.path}`,
    )({ teamId });
    return json;
  },
});
