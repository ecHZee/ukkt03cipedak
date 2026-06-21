import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/public/landing/Navbar";
import { Hero } from "@/components/public/landing/Hero";
import { RunningBanner } from "@/components/public/landing/RunningBanner";
import { LiveClockCalendar } from "@/components/public/landing/LiveClockCalendar";
import { StatsStrip } from "@/components/public/landing/StatsStrip";
import { AboutPreview } from "@/components/public/landing/AboutPreview";
import { ProgramBento } from "@/components/public/landing/ProgramBento";
import { KegiatanLatest } from "@/components/public/landing/KegiatanLatest";
import { BeritaLatest } from "@/components/public/landing/BeritaLatest";
import { GaleriPreview } from "@/components/public/landing/GaleriPreview";
import { LpjPreview } from "@/components/public/landing/LpjPreview";
import { KontakSection } from "@/components/public/landing/KontakSection";
import { Footer } from "@/components/public/landing/Footer";
import { SectionHeader } from "@/components/public/landing/SectionHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Markas digital Karang Taruna RW 03 Cipedak — kegiatan, berita, galeri, dan transparansi LPJ lintas periode.",
      },
      { property: "og:title", content: "Karang Taruna RW 03 Cipedak" },
      {
        property: "og:description",
        content:
          "Markas digital Karang Taruna RW 03 Cipedak — kegiatan, berita, galeri, dan transparansi LPJ lintas periode.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <RunningBanner />

        {/* Clock + Calendar + Stats */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <LiveClockCalendar />
          <div className="mt-8">
            <StatsStrip />
          </div>
        </section>

        {/* About */}
        <section className="bg-muted-surface/60">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
            <AboutPreview />
          </div>
        </section>

        {/* Program */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <SectionHeader
            number="01"
            eyebrow="Program Kerja"
            title="Enam pilar gerakan Karang Taruna"
            description="Setiap pilar dikelola oleh bidang spesifik dan dievaluasi melalui LPJ periodik."
            actionLabel="Lihat semua"
            actionTo="/program"
          />
          <ProgramBento />
        </section>

        {/* Kegiatan */}
        <section className="bg-muted-surface/60">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
            <SectionHeader
              number="02"
              eyebrow="Kegiatan Terbaru"
              title="Yang sedang berjalan & yang akan datang"
              actionLabel="Semua kegiatan"
              actionTo="/kegiatan"
            />
            <KegiatanLatest />
          </div>
        </section>

        {/* Berita */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <SectionHeader
            number="03"
            eyebrow="Berita"
            title="Cerita dari Karang Taruna RW 03"
            actionLabel="Arsip berita"
            actionTo="/berita"
          />
          <BeritaLatest />
        </section>

        {/* Galeri */}
        <section className="bg-muted-surface/60">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
            <SectionHeader
              number="04"
              eyebrow="Galeri"
              title="Dokumentasi kegiatan dalam satu bingkai"
              actionLabel="Buka galeri"
              actionTo="/galeri"
            />
            <GaleriPreview />
          </div>
        </section>

        {/* LPJ */}
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <SectionHeader
            number="05"
            eyebrow="Transparansi"
            title="Laporan Pertanggungjawaban terbaru"
            description="Setiap kegiatan didokumentasikan dan dapat diunduh publik. Komitmen transparansi lintas periode."
            actionLabel="Semua LPJ"
            actionTo="/lpj"
          />
          <LpjPreview />
        </section>

        {/* Kontak */}
        <section className="bg-muted-surface/60">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-24">
            <SectionHeader
              number="06"
              eyebrow="Kontak"
              title="Sapa kami di kanal resmi"
              description="Tidak ada formulir kontak — gunakan kanal langsung agar respons lebih cepat."
            />
            <KontakSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
