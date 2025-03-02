import { getHealthHeartbeat } from "@/queries/health";
import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const HomeComponent = () => {
  const { data } = useQuery(getHealthHeartbeat());

  return <Box>Home: version: {data?.version} </Box>;
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
