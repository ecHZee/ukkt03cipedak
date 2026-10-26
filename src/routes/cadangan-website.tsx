import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageShell } from "@/components/public/PageShell";

export const Route = createFileRoute("/cadangan-website")({
  component: () => (
    <PageShell>
      <Outlet />
    </PageShell>
  ),
});
