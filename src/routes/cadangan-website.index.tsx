import { createFileRoute } from "@tanstack/react-router";
import { InformasiCadangan } from "@/components/public/InformasiCadangan";
import { informasiCadangan } from "@/domains/cadangan/informasi";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/cadangan-website/")({
  head: () =>
    generateMetadata({
      title: informasiCadangan.aplikasi.judul,
      description: informasiCadangan.aplikasi.deskripsi,
      path: "/cadangan-website",
      noindex: true,
    }),
  component: () => <InformasiCadangan bagian="aplikasi" />,
});
