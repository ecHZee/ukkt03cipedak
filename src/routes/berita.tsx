import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Newspaper, Pin } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { Placeholder } from "@/components/public/Placeholder";
import { BERITA_LIST } from "@/domains/berita/data";
import { BIDANG_LIST, BIDANG_BY_SLUG } from "@/domains/program/data";

export const Route = createFileRoute("/berita")({
  head: () => ({
    meta: [
      { title: "Berita — Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Berita resmi Karang Taruna RW 03 Cipedak — pengumuman, liputan kegiatan, dan arsip lintas bidang.",
      },
    ],
  }),
  component: BeritaPage,
});

function catLabel(c: string) {
  if (c === "umum") return "Umum";
  return BIDANG_BY_SLUG[c as keyof typeof BIDANG_BY_SLUG]?.short.replace(".", "") ?? c;
}

function BeritaPage() {
  const [cat, setCat] = useState<string>("semua");

  /**
   * Featured News dinamis (Design Freeze BAGIAN 3):
   * Prioritas: 1) Manual Pin → 2) Berita Terbaru → 3) Berita Populer.
   */
  const featured = useMemo(() => {
    const pinned = BERITA_LIST.find((b) => b.pinned);
    if (pinned) return pinned;
    const byDate = [...BERITA_LIST].sort((a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
    )[0];
    if (byDate) return byDate;
    return [...BERITA_LIST].sort(
      (a, b) => (b.popularitas ?? 0) - (a.popularitas ?? 0),
    )[0];
  }, []);

  const secondary = useMemo(
    () => BERITA_LIST.filter((b) => b.id !== featured.id && (cat === "semua" || b.kategori === cat)),
    [cat, featured.id],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Arsip Resmi"
        title="Berita Karang Taruna RW 03"
        description="Pengumuman, liputan, dan arsip kegiatan lintas bidang."
        variant="editorial"
      />

      {/* Featured */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              01 · Berita Utama
            </p>
            {featured.pinned && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                <Pin className="size-3" /> Manual Pin
              </span>
            )}
          </div>
          <article className="mt-4 grid gap-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-tile lg:grid-cols-2">
            <div className="aspect-[16/10] lg:aspect-auto">
              <Placeholder
                label="Cover berita utama"
                caption="Foto resmi menyusul"
                icon={Newspaper}
                tone="ink"
                rounded="rounded-none"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="inline-flex w-fit rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                {catLabel(featured.kategori)}
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-ink leading-tight">
                {featured.judul}
              </h2>
              <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
                {featured.ringkasan}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-ink-muted tabular-nums">{featured.tanggal} · {featured.penulis}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Baca Selengkapnya <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Kategori filter + Secondary */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                02 · Berita Lainnya
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-ink">
                Pilih kategori
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <CatChip active={cat === "semua"} onClick={() => setCat("semua")}>Semua</CatChip>
              <CatChip active={cat === "umum"} onClick={() => setCat("umum")}>Umum</CatChip>
              {BIDANG_LIST.map((b) => (
                <CatChip key={b.slug} active={cat === b.slug} onClick={() => setCat(b.slug)}>
                  {b.short.replace(".", "")}
                </CatChip>
              ))}
            </div>
          </div>

          {secondary.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-muted-surface/40 p-10 text-center text-sm text-ink-muted">
              Belum ada berita untuk kategori ini.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {secondary.map((b) => (
                <article
                  key={b.id}
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-tile transition hover:shadow-tile-hover hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-muted-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {catLabel(b.kategori)}
                    </span>
                    <span className="text-[11px] text-ink-muted tabular-nums">{b.tanggal}</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-ink leading-snug line-clamp-3 group-hover:text-primary transition">
                    {b.judul}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">{b.ringkasan}</p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <p className="text-[11px] text-ink-muted truncate">{b.penulis}</p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-primary transition hover:border-primary"
                    >
                      Baca Selengkapnya <ArrowRight className="size-3" />
                    </button>
                  </div>
                  {b.placeholder && (
                    <p className="text-[10px] uppercase tracking-wider text-warning">
                      Konten menyusul
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function CatChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-ink hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}
