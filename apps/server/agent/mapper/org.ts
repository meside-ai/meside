import type { OrgDto } from "@meside/shared/api/org.schema";
import type { OrgEntity } from "../table/org";

export const getOrgDtos = async (orgs: OrgEntity[]): Promise<OrgDto[]> => {
  const orgsDto = orgs.map((org) => {
    return {
      ...org,
    };
  });

  return orgsDto;
};
