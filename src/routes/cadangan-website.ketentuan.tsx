import { createFileRoute } from "@tanstack/react-router";
import { InformasiCadangan } from "@/components/public/InformasiCadangan";
import { informasiCadangan } from "@/domains/cadangan/informasi";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/cadangan-website/ketentuan")({
  head: () =>
    generateMetadata({
      title: informasiCadangan.ketentuan.judul,
      description: informasiCadangan.ketentuan.deskripsi,
      path: "/cadangan-website/ketentuan",
      noindex: true,
    }),
  component: () => <InformasiCadangan bagian="ketentuan" />,
});
