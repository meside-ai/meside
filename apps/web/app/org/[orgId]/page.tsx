"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrgIndexPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  useEffect(() => {
    // Redirect to the channel directory
    router.push(`/org/${orgId}/channel`);
  }, [orgId, router]);

  return null;
}
