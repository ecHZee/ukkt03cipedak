import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { Placeholder } from "@/components/public/Placeholder";
import { EmptyState } from "@/components/shared/EmptyState";
import { ALBUMS, KATEGORI_META, type GaleriKategori } from "@/domains/galeri/data";

export const Route = createFileRoute("/galeri")({ component: Page });

function Page() {
  const [tahun, setTahun] = useState<"semua" | number>("semua");
  const [kategori, setKategori] = useState<"semua" | GaleriKategori>("semua");
  const [active, setActive] = useState<{ albumId: string; index: number } | null>(null);

  const tahunList = useMemo(
    () => Array.from(new Set(ALBUMS.map((a) => a.tahun))).sort((a, b) => b - a),
    [],
  );
  const filtered = ALBUMS.filter(
    (a) =>
      (tahun === "semua" || a.tahun === tahun) &&
      (kategori === "semua" || a.kategori === kategori),
  );

  const totalFoto = ALBUMS.reduce((acc, a) => acc + a.jumlah, 0);
  const activeAlbum = active ? ALBUMS.find((a) => a.id === active.albumId) : null;

  return (
    <PageShell>
      <PageHero
        eyebrow="Galeri Dokumentasi"
        title="Setiap kegiatan kami dokumentasikan."
        description="Arsip visual Karang Taruna RW 03 Cipedak — disusun per album kegiatan dan terbuka untuk warga."
        variant="dark"
      >
        <div className="flex flex-wrap gap-3 text-sm text-white/85">
          <Stat label="Album" value={ALBUMS.length} />
          <Stat label="Dokumentasi" value={totalFoto} />
          <Stat label="Kategori" value={Object.keys(KATEGORI_META).length} />
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12">
        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Tahun</span>
            <Pill active={tahun === "semua"} onClick={() => setTahun("semua")}>Semua</Pill>
            {tahunList.map((t) => (
              <Pill key={t} active={tahun === t} onClick={() => setTahun(t)}>{t}</Pill>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Kategori</span>
            <Pill active={kategori === "semua"} onClick={() => setKategori("semua")}>Semua</Pill>
            {(Object.keys(KATEGORI_META) as GaleriKategori[]).map((k) => (
              <Pill key={k} active={kategori === k} onClick={() => setKategori(k)}>
                {KATEGORI_META[k].label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Albums (masonry-ish via CSS columns) */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Belum ada album pada filter ini"
              description="Coba ganti filter tahun atau kategori."
            />
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
              {filtered.map((album, idx) => {
                const meta = KATEGORI_META[album.kategori];
                const Icon = meta.icon;
                return (
                  <article
                    key={album.id}
                    className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile transition hover:shadow-tile-hover animate-fade-in-up"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => setActive({ albumId: album.id, index: 0 })}
                      className="block w-full"
                    >
                      <div className={idx % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}>
                        <Placeholder
                          label={album.judul}
                          caption={`${album.jumlah} dokumentasi · ${meta.label}`}
                          icon={Icon}
                          tone={idx % 2 === 0 ? "neutral" : "accent"}
                          rounded="rounded-none"
                        />
                      </div>
                    </button>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.tone}`}>
                          <Icon className="size-3" />
                          {meta.label}
                        </span>
                        <span className="text-[11px] tabular-nums text-ink-muted">{album.tahun}</span>
                      </div>
                      <h3 className="mt-2 font-heading text-[15px] font-semibold text-ink leading-snug line-clamp-2">
                        {album.judul}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted tabular-nums">
                        {album.tanggal} · {album.jumlah} dokumentasi
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {active && activeAlbum && (
        <Lightbox
          album={activeAlbum}
          index={active.index}
          onClose={() => setActive(null)}
          onPrev={() =>
            setActive((s) =>
              s ? { ...s, index: (s.index - 1 + activeAlbum.jumlah) % activeAlbum.jumlah } : s,
            )
          }
          onNext={() =>
            setActive((s) =>
              s ? { ...s, index: (s.index + 1) % activeAlbum.jumlah } : s,
            )
          }
        />
      )}
    </PageShell>
  );
}

function Pill({
  active, onClick, children,
}: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-ink hover:border-primary/40 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/70">{label}</p>
      <p className="font-heading text-base font-semibold tabular-nums text-white">{value}</p>
    </div>
  );
}

function Lightbox({
  album, index, onClose, onPrev, onNext,
}: {
  album: typeof ALBUMS[number];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const meta = KATEGORI_META[album.kategori];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Pratinjau ${album.judul}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-video overflow-hidden rounded-xl bg-ink">
          <Placeholder
            label={`${album.judul} — ${index + 1}/${album.jumlah}`}
            caption="Dokumentasi asli menyusul"
            icon={meta.icon}
            tone="ink"
            rounded="rounded-xl"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-white">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">{meta.label}</p>
            <p className="truncate font-heading text-sm font-semibold">{album.judul}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onPrev} aria-label="Sebelumnya"
              className="grid size-10 place-items-center rounded-lg border border-white/20 hover:bg-white/10">
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-xs tabular-nums">{index + 1} / {album.jumlah}</span>
            <button onClick={onNext} aria-label="Selanjutnya"
              className="grid size-10 place-items-center rounded-lg border border-white/20 hover:bg-white/10">
              <ChevronRight className="size-5" />
            </button>
            <button onClick={onClose} aria-label="Tutup"
              className="grid size-10 place-items-center rounded-lg border border-white/20 hover:bg-white/10">
              <X className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
