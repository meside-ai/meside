"use client";

import { redirect, useParams } from "next/navigation";

export default function SettingsPage() {
  const { orgId } = useParams<{ orgId: string }>();

  return redirect(`/org/${orgId}/setting/team`);
}
