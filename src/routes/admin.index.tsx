import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ADMIN_ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/admin/")({
  component: () => <Navigate to={ADMIN_ROUTES.dashboard} replace />,
});