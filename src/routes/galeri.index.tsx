import { urlPratinjauMedia } from "@/lib/pratinjau-media";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image as ImageIcon } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { Placeholder } from "@/components/public/Placeholder";
import { FotoGaleri } from "@/components/public/FotoGaleri";
import { EmptyState } from "@/components/shared/EmptyState";
import { gayaBidang } from "@/domains/program/style";
import { ambilAlbum } from "@/services/konten";
import { ambilBidang } from "@/services/organisasi";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/galeri/")({
  head: () =>
    generateMetadata({
      title: "Galeri",
      description: "Pilih album untuk melihat foto dan video kegiatan Karang Taruna RW 03 Cipedak.",
      path: "/galeri",
    }),
  loader: async () => {
    const [album, bidang] = await Promise.all([ambilAlbum(), ambilBidang()]);
    return { album, bidang };
  },
  component: DaftarAlbum,
});

function DaftarAlbum() {
  const { album, bidang } = Route.useLoaderData();
  const namaBidang = Object.fromEntries(bidang.map((b) => [b.slug, b.singkat]));
  const [tahun, setTahun] = useState<"semua" | number>("semua");
  const [kategori, setKategori] = useState("semua");
  const tahunList = useMemo(
    () =>
      Array.from(new Set(album.map((a) => a.tahun).filter((t): t is number => t !== null))).sort(
        (a, b) => b - a,
      ),
    [album],
  );
  const bidangDipakai = bidang.filter((b) => album.some((a) => a.bidang === b.slug));
  const filtered = album.filter(
    (a) =>
      (tahun === "semua" || a.tahun === tahun) && (kategori === "semua" || a.bidang === kategori),
  );
  return (
    <PageShell>
      <PageHero
        eyebrow="Galeri Dokumentasi"
        title="Setiap kegiatan kami dokumentasikan."
        description="Pilih album untuk melihat foto dan video kegiatan Karang Taruna RW 03 Cipedak."
      >
        {album.length > 0 && (
          <p className="text-sm text-white/85">
            {album.length} album · {album.reduce((n, a) => n + a.jumlahMedia, 0)} dokumentasi
          </p>
        )}
      </PageHero>
      <section className="mx-auto w-full max-w-[1280px] px-6 py-10 md:px-10 lg:px-16">
        {album.length > 0 && (
          <div className="mb-8 flex flex-col gap-4">
            <div
              role="group"
              aria-label="Filter tahun"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="mr-1 text-sm font-semibold text-ink-muted">Tahun</span>
              <Pill active={tahun === "semua"} onClick={() => setTahun("semua")}>
                Semua
              </Pill>
              {tahunList.map((t) => (
                <Pill key={t} active={tahun === t} onClick={() => setTahun(t)}>
                  {t}
                </Pill>
              ))}
            </div>
            {bidangDipakai.length > 0 && (
              <div
                role="group"
                aria-label="Filter bidang"
                className="flex flex-wrap items-center gap-2"
              >
                <span className="mr-1 text-sm font-semibold text-ink-muted">Bidang</span>
                <Pill active={kategori === "semua"} onClick={() => setKategori("semua")}>
                  Semua
                </Pill>
                {bidangDipakai.map((b) => (
                  <Pill
                    key={b.slug}
                    active={kategori === b.slug}
                    onClick={() => setKategori(b.slug)}
                  >
                    {b.singkat}
                  </Pill>
                ))}
              </div>
            )}
            <p role="status" className="text-sm text-ink-muted">
              {filtered.length} album ditampilkan
            </p>
          </div>
        )}
        {filtered.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title={
              album.length === 0
                ? "Album dokumentasi segera hadir"
                : "Belum ada album pada filter ini"
            }
            description={
              album.length === 0
                ? "Dokumentasi kegiatan akan dipublikasikan oleh Bidang Media."
                : "Coba ganti filter tahun atau bidang."
            }
          />
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>article]:mb-5 [&>article]:break-inside-avoid">
            {filtered.map((a) => {
              const gaya = gayaBidang(a.bidang ?? "");
              const Icon = gaya.icon;
              const label = a.bidang ? (namaBidang[a.bidang] ?? "Umum") : "Umum";
              return (
                <article
                  key={a.id}
                  className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile transition hover:shadow-tile-hover"
                >
                  <Link
                    to="/galeri/$album"
                    params={{ album: a.slug }}
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      {a.sampul ? (
                        <FotoGaleri
                          url={urlPratinjauMedia(a.sampul.url)}
                          fallbackUrl={a.sampul.url}
                          alt={a.sampul.caption || a.judul}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Placeholder
                          label={a.judul}
                          caption="Sampul belum tersedia"
                          icon={Icon}
                          rounded="rounded-none"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${gaya.iconBg}`}
                      >
                        <Icon className="size-3" aria-hidden="true" />
                        {label}
                      </span>
                      <h2 className="mt-2 break-words font-heading text-base font-semibold leading-snug text-ink">
                        {a.judul}
                      </h2>
                      <p className="mt-2 text-xs text-ink-muted">
                        {[a.tanggal, `${a.jumlahMedia} dokumentasi`].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-primary">Lihat album →</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-ink hover:border-primary/40 hover:text-primary"}`}
    >
      {children}
    </button>
  );
}
