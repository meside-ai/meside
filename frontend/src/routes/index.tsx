import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const HomeComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/question" });
  }, [navigate]);

  return null;
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
