import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { HumanDirectory } from "@/components/public/anggota/HumanDirectory";
import { ambilOrganisasi } from "@/services/organisasi";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/tentang/pengurus")({
  head: () =>
    generateMetadata({
      title: "Direktori Pengurus",
      description:
        "Kenali penasihat, BPH, dan pengurus tujuh bidang Karang Taruna RW 03 Cipedak. Filter bidang dan buka profil pengurus.",
      path: "/tentang/pengurus",
    }),
  loader: ambilOrganisasi,
  component: PengurusPage,
});

function PengurusPage() {
  const { periodeAktif: p, pengurus, bidang } = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero
        eyebrow={`Periode ${p.label}`}
        title="Direktori pengurus"
        description="Penasihat, Badan Pengurus Harian, dan tujuh bidang kerja Karang Taruna RW 03 Cipedak."
      />
      <section
        aria-label="Direktori pengurus"
        className="mx-auto max-w-[1280px] px-6 py-10 md:px-10 lg:px-16"
      >
        <Link
          to="/tentang"
          className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
        >
          ← Tentang organisasi
        </Link>
        {p.nomorSK && (
          <p className="mb-6 text-sm leading-relaxed text-ink-muted [overflow-wrap:anywhere]">
            Struktur kepengurusan sesuai SK No. {p.nomorSK}
            {p.tanggalSK ? `, tanggal ${p.tanggalSK}` : ""}. Pilih kartu untuk melihat profil.
          </p>
        )}
        <HumanDirectory pengurus={pengurus} bidang={bidang} />
      </section>
    </PageShell>
  );
}
