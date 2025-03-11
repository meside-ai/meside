import { getHealthHeartbeat } from "@/queries/health";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useQuery(getHealthHeartbeat());

  return (
    <>
      <Outlet />
    </>
  );
}
