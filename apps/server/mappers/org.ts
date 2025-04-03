import type { OrgDto } from "@meside/shared/api/org.schema";
import type { OrgEntity } from "../db/schema/org";

export const getOrgDtos = async (orgs: OrgEntity[]): Promise<OrgDto[]> => {
  const orgsDto = orgs.map((org) => {
    return {
      ...org,
    };
  });

  return orgsDto;
};
