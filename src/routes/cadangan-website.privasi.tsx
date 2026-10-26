import { createFileRoute } from "@tanstack/react-router";
import { InformasiCadangan } from "@/components/public/InformasiCadangan";
import { informasiCadangan } from "@/domains/cadangan/informasi";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/cadangan-website/privasi")({
  head: () =>
    generateMetadata({
      title: informasiCadangan.privasi.judul,
      description: informasiCadangan.privasi.deskripsi,
      path: "/cadangan-website/privasi",
      noindex: true,
    }),
  component: () => <InformasiCadangan bagian="privasi" />,
});
