import { createFileRoute, redirect } from "@tanstack/react-router";
import { ruangPengurusFn } from "@/services/hari20-admin.functions";
import { PengurusKelola } from "@/components/admin/PengurusKelola";
export const Route = createFileRoute("/admin/pengurus-kelola")({
  beforeLoad: ({ context }) => {
    if (!context.akun.lintasBidang) throw redirect({ to: "/admin/anggota" });
  },
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  loader: () => ruangPengurusFn(),
  component: Page,
});
function Page() {
  return <PengurusKelola ruang={Route.useLoaderData()} />;
}
