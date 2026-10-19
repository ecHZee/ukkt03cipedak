import { createFileRoute } from "@tanstack/react-router";
import { ruangDokumenFn } from "@/services/hari20-admin.functions";
import { DokumenKelola } from "@/components/admin/DokumenKelola";
export const Route = createFileRoute("/admin/dokumen")({
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  loader: () => ruangDokumenFn(),
  component: Page,
});
function Page() {
  return <DokumenKelola ruang={Route.useLoaderData()} />;
}
