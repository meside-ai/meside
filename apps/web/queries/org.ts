import {
  type OrgCreateRequest,
  type OrgCreateResponse,
  type OrgDetailRequest,
  type OrgDetailResponse,
  type OrgListRequest,
  type OrgListResponse,
  type OrgUpdateRequest,
  type OrgUpdateResponse,
  orgCreateRoute,
  orgDetailRoute,
  orgListRoute,
  orgUpdateRoute,
} from "@meside/shared/api/org.schema";
import { createPost } from "@meside/shared/request/index";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { QueryClientError } from "../utils/query-client";

export const getOrgList = (
  params: OrgListRequest,
): UseQueryOptions<OrgListResponse> => ({
  enabled: true,
  queryKey: [getOrgList.name],
  queryFn: async () => {
    const json = await createPost<OrgListRequest, OrgListResponse>(
      `/meside/server/org${orgListRoute.path}`,
    )(params);
    return json;
  },
});

export const getOrgDetail = ({
  orgId,
}: OrgDetailRequest): UseQueryOptions<OrgDetailResponse> => ({
  enabled: !!orgId,
  queryKey: [getOrgDetail.name, orgId],
  queryFn: async () => {
    const json = await createPost<OrgDetailRequest, OrgDetailResponse>(
      `/meside/server/org${orgDetailRoute.path}`,
    )({ orgId });
    return json;
  },
});

export const getOrgCreate = (): UseMutationOptions<
  OrgCreateResponse,
  QueryClientError,
  OrgCreateRequest
> => ({
  mutationKey: [getOrgCreate.name],
  mutationFn: async (body) => {
    const json = await createPost<OrgCreateRequest, OrgCreateResponse>(
      `/meside/server/org${orgCreateRoute.path}`,
    )(body);
    return json;
  },
});

export const getOrgUpdate = (): UseMutationOptions<
  OrgUpdateResponse,
  QueryClientError,
  OrgUpdateRequest
> => ({
  mutationKey: [getOrgUpdate.name],
  mutationFn: async (body) => {
    const json = await createPost<OrgUpdateRequest, OrgUpdateResponse>(
      `/meside/server/org${orgUpdateRoute.path}`,
    )(body);
    return json;
  },
});
