"use client";

import { Box } from "@mantine/core";
import { useParams } from "next/navigation";
import { ChannelContent } from "../../../../components/channel/channel-content";
import { ChannelSidebar } from "../../../../components/channel/channel-sidebar";

// Demo data for channels
const CHANNELS = [
  { id: "database", name: "Database team" },
  { id: "jira", name: "Jira team" },
  { id: "support", name: "Support team" },
];

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;

  // Find the current channel with a default fallback
  const currentChannel =
    CHANNELS.find((channel) => channel.id === channelId) || CHANNELS[0];

  // Ensure we always have a valid channel
  const channelName = currentChannel?.name || "Team Channel";

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      style={{
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <ChannelSidebar />
      <ChannelContent channelName={channelName} />
    </Box>
  );
}
