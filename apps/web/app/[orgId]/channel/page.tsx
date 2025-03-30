"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// Default channel to redirect to
const DEFAULT_CHANNEL = "database";

export default function ChannelIndexPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  useEffect(() => {
    // Redirect to the default channel
    router.push(`/${orgId}/channel/${DEFAULT_CHANNEL}`);
  }, [orgId, router]);

  return null;
}
