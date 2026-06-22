import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText, Newspaper } from "lucide-react";
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
  const featured = BERITA_LIST.find((b) => b.featured) ?? BERITA_LIST[0];

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
      />

      {/* Featured */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            01 · Berita Utama
          </p>
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
              <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
                <span className="tabular-nums">{featured.tanggal} · {featured.penulis}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Baca <ArrowRight className="size-3.5" />
                </span>
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
                  <p className="mt-auto text-[11px] text-ink-muted">{b.penulis}</p>
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

      {/* Arsip CTA */}
      <section className="bg-muted-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 shadow-tile">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="font-heading font-semibold text-ink">Arsip Berita</p>
                <p className="text-xs text-ink-muted">
                  Arsip lintas periode akan ditampilkan setelah modul arsip aktif (Sprint berikutnya).
                </p>
              </div>
            </div>
            <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              Segera hadir
            </span>
          </div>
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
