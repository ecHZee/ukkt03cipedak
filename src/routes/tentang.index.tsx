import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ambilOrganisasi } from "@/services/organisasi";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/tentang/")({
  head: () =>
    generateMetadata({
      title: "Tentang Karang Taruna RW 03",
      description:
        "Profil, dasar hukum, dan riwayat kepengurusan Karang Taruna RW 03 Cipedak. Kenali pengurus dan tujuh bidang kerjanya.",
      path: "/tentang",
    }),
  loader: ambilOrganisasi,
  component: TentangPage,
});

function TentangPage() {
  const { periodeAktif: p, riwayatPeriode, pengurus, bidang } = Route.useLoaderData();
  const aktif = pengurus.filter((a) => a.group !== "PENASIHAT").length;
  const penasihat = pengurus.filter((a) => a.group === "PENASIHAT").length;
  return (
    <PageShell>
      <PageHero
        eyebrow={`Periode ${p.label}`}
        title="Tentang Karang Taruna RW 03"
        description="Kenali organisasi pemuda RW 03 Cipedak, kepengurusan, dan dasar hukumnya."
      />
      <section className="mx-auto grid max-w-[1280px] gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:px-16">
        <div className="min-w-0">
          <h2 className="font-heading text-2xl font-bold text-ink">
            Bergerak bersama pemuda RW 03 Cipedak
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Karang Taruna RW 03 berada di Kelurahan Cipedak, Kecamatan Jagakarsa, Jakarta Selatan.
            Kepengurusan periode {p.label} terdiri dari {aktif} pengurus dan {penasihat} penasihat,
            dengan {bidang.length} bidang kerja.
          </p>
          <Accordion
            type="multiple"
            defaultValue={["profil"]}
            className="mt-6 rounded-xl border border-border bg-surface px-5 motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:!transition-none"
          >
            <AccordionItem value="profil">
              <AccordionTrigger className="min-h-14 gap-4 font-heading font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                Profil organisasi
              </AccordionTrigger>
              <AccordionContent className="space-y-3 leading-relaxed text-ink-muted">
                <p>
                  Website ini memuat kegiatan, berita, dokumentasi, arsip, serta struktur
                  kepengurusan Karang Taruna RW 03 Cipedak.
                </p>
                {p.nomorSK && (
                  <p className="[overflow-wrap:anywhere]">
                    Dasar kepengurusan periode {p.label}: SK No. {p.nomorSK}
                    {p.tanggalSK ? `, tanggal ${p.tanggalSK}` : ""}.
                  </p>
                )}
                <Link
                  to="/program"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4"
                >
                  Kenali {bidang.length} bidang kerja <ArrowRight className="size-4" aria-hidden />
                </Link>
              </AccordionContent>
            </AccordionItem>
            {/* Sejarah pendirian, visi, dan misi menunggu naskah sah dari BPH.
                Tanggal SK bukan bukti tanggal pendirian atau pelantikan. */}
            <AccordionItem value="riwayat">
              <AccordionTrigger className="min-h-14 gap-4 font-heading font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                Riwayat kepengurusan
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 text-ink-muted">
                  {riwayatPeriode.map((r) => (
                    <li
                      key={r.id}
                      className="border-l-2 border-accent pl-4 [overflow-wrap:anywhere]"
                    >
                      <p className="font-semibold text-ink">
                        {r.label} · {r.aktif ? "Periode aktif" : "Periode terdahulu"}
                      </p>
                      {r.nomorSK && <p className="mt-1">SK No. {r.nomorSK}</p>}
                      {r.tanggalSK && <p className="mt-1">Tanggal SK: {r.tanggalSK}</p>}
                      {r.tanggalPelantikan && (
                        <p className="mt-1">Pelantikan: {r.tanggalPelantikan}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hukum" className="border-b-0">
              <AccordionTrigger className="min-h-14 gap-4 font-heading font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                Dasar hukum
              </AccordionTrigger>
              <AccordionContent className="space-y-3 leading-relaxed text-ink-muted">
                <p>
                  Peraturan Menteri Sosial Nomor 25 Tahun 2019 tentang Karang Taruna, sebagaimana
                  diubah dengan Peraturan Menteri Sosial Nomor 9 Tahun 2025.
                </p>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="https://peraturan.bpk.go.id/Details/129419/permensos-no-25-tahun-2019"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                    >
                      Permensos 25/2019 · JDIH BPK ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://peraturan.bpk.go.id/Details/325168/permensos-no-9-tahun-2025"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                    >
                      Perubahan: Permensos 9/2025 · JDIH BPK ↗
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <aside className="min-w-0 self-start rounded-xl border border-accent/30 bg-accent/10 p-6 sm:p-8">
          <p className="text-sm font-semibold text-accent-foreground">Kepengurusan {p.label}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-ink">
            Kenali orang-orang di balik kegiatan kita.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            {pengurus.length} nama dalam struktur kepengurusan: {aktif} pengurus dan {penasihat}{" "}
            penasihat. Telusuri menurut bidang, lalu buka kartu untuk melihat profilnya.
          </p>
          <Link
            to="/tentang/pengurus"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Lihat direktori pengurus <ArrowRight className="size-4" aria-hidden />
          </Link>
        </aside>
      </section>
    </PageShell>
  );
}
