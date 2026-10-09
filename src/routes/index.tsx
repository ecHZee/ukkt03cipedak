import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/public/landing/Navbar";
import { Hero } from "@/components/public/landing/Hero";
import { RunningBanner } from "@/components/public/landing/RunningBanner";
import { StatsStrip } from "@/components/public/landing/StatsStrip";
import { AboutPreview } from "@/components/public/landing/AboutPreview";
import { ProgramBento } from "@/components/public/landing/ProgramBento";
import { KegiatanLatest } from "@/components/public/landing/KegiatanLatest";
import { BeritaLatest } from "@/components/public/landing/BeritaLatest";
import { GaleriPreview } from "@/components/public/landing/GaleriPreview";
import { AjakanSection } from "@/components/public/landing/AjakanSection";
import { PengumumanBanner } from "@/components/public/landing/PengumumanBanner";
import { Footer } from "@/components/public/landing/Footer";
import { SectionHeader } from "@/components/public/landing/SectionHeader";

import { ambilAlbum, ambilBerita, ambilKegiatan, pilihKegiatanTerdekat } from "@/services/konten";
import { ambilBidang, hitungPengurusAktif } from "@/services/organisasi";
import { useSitus } from "@/hooks/use-situs";

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
  loader: async () => {
    const [kegiatan, berita, album, bidang, pengurusAktif] = await Promise.all([
      ambilKegiatan(),
      ambilBerita(),
      ambilAlbum(),
      ambilBidang(),
      hitungPengurusAktif(),
    ]);
    return { kegiatan, berita, album, bidang, pengurusAktif };
  },
  component: Index,
});

function Index() {
  const { kegiatan, berita, album, bidang, pengurusAktif } = Route.useLoaderData();
  const { pengaturan } = useSitus();
  const namaBidang = Object.fromEntries(bidang.map((b) => [b.slug, b.singkat]));
  const terdekat = pilihKegiatanTerdekat(kegiatan);
  const rutin = kegiatan.filter((k) => k.rutin && k.jadwal).map((k) => `${k.judul} · ${k.jadwal}`);

  // Bagian tanpa data disembunyikan; nomor bagian dihitung dari yang tampil saja.
  let nomor = 0;
  const no = () => String(++nomor).padStart(2, "0");
  const wrap = "mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12 md:py-24";

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <PengumumanBanner />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <RunningBanner bidang={bidang} rutin={rutin} />

        {/* About */}
        <section className="bg-background">
          <div className={wrap}>
            <AboutPreview />
            <div className="mt-12">
              <StatsStrip
                data={{
                  pengurusAktif,
                  jumlahRt: pengaturan.jumlahRt,
                  jumlahBidang: bidang.length,
                  kegiatanTercatat: kegiatan.length,
                }}
              />
            </div>
          </div>
        </section>

        {bidang.length > 0 && (
          <section className="bg-surface">
            <div className={wrap}>
              <SectionHeader
                number={no()}
                eyebrow="Program Kerja"
                title={`${bidang.length} bidang gerakan Karang Taruna`}
                description="Setiap bidang dikelola pengurus periode aktif dan dievaluasi melalui LPJ."
                actionLabel="Lihat semua"
                actionTo="/program"
              />
              <ProgramBento bidang={bidang} />
            </div>
          </section>
        )}

        {terdekat.items.length > 0 && (
          <section className="bg-muted-surface">
            <div className={wrap}>
              <SectionHeader
                number={no()}
                eyebrow={
                  terdekat.judul === "akan-datang" ? "Kegiatan Terdekat" : "Kegiatan Terakhir"
                }
                title={
                  terdekat.judul === "akan-datang"
                    ? "Yang akan datang & kegiatan rutin"
                    : "Kegiatan yang sudah berjalan"
                }
                actionLabel="Semua kegiatan"
                actionTo="/kegiatan"
              />
              <KegiatanLatest items={terdekat.items} namaBidang={namaBidang} />
            </div>
          </section>
        )}

        {berita.length > 0 && (
          <section className="bg-background">
            <div className={wrap}>
              <SectionHeader
                number={no()}
                eyebrow="Berita"
                title="Cerita dari Karang Taruna RW 03"
                actionLabel="Arsip berita"
                actionTo="/berita"
              />
              <BeritaLatest berita={berita} namaBidang={namaBidang} />
            </div>
          </section>
        )}

        {album.length > 0 && (
          <section className="bg-muted-surface">
            <div className={wrap}>
              <SectionHeader
                number={no()}
                eyebrow="Galeri"
                title="Dokumentasi kegiatan dalam satu bingkai"
                actionLabel="Buka galeri"
                actionTo="/galeri"
              />
              <GaleriPreview albums={album} />
            </div>
          </section>
        )}

        {/* Penutup: Gabung · Usul kegiatan · Hubungi (menggantikan Info Singkat, Kalender, Kontak) */}
        <section className="bg-background">
          <div className={wrap}>
            <SectionHeader
              number={no()}
              eyebrow="Ikut Bergerak"
              title="Kampung ini butuh tenagamu"
              description="Satu pesan WhatsApp ke sekretariat sudah cukup untuk mulai."
              actionLabel="Kontak lengkap"
              actionTo="/kontak"
            />
            <AjakanSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
