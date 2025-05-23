"use client";

import { Alert, Box, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrgList } from "../../queries/org";

export default function Page() {
  const orgListQuery = useQuery(getOrgList({}));
  const orgList = orgListQuery.data?.orgs;

  if (orgListQuery.isLoading) {
    return <LoadingOverlay />;
  }

  if (orgListQuery.isError) {
    return <Alert color="red">Error loading org list</Alert>;
  }

  if (!orgList) {
    return <Alert color="red">No org list found</Alert>;
  }

  const org = orgList[0];

  if (!org) {
    return redirect("/org/create");
  }

  if (orgList.length === 1) {
    return redirect(`/org/${org.orgId}/channel`);
  }

  return (
    <Box>
      {orgList.map((org) => (
        <Link key={org.orgId} href={`/org/${org.orgId}/channel`}>
          {org.name}
        </Link>
      ))}
    </Box>
  );
}
