import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KartuAgenda } from "@/components/public/KartuAgenda";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { useSitus } from "@/hooks/use-situs";
import type { KegiatanTahap } from "@/domains/konten/types";
import { ambilKegiatan } from "@/services/konten";
import { ambilBidang } from "@/services/organisasi";
import { FilterBidang } from "@/components/public/FilterBidang";
import { bacaFilterKegiatan, cocokBidang } from "@/lib/filter-publik";

export const Route = createFileRoute("/kegiatan/")({
  validateSearch: bacaFilterKegiatan,
  head: () => ({
    meta: [
      { title: "Kegiatan — Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Garis waktu kegiatan Karang Taruna RW 03 Cipedak — rencana, sedang berjalan, dan yang sudah selesai.",
      },
    ],
  }),
  loader: async () => {
    const [kegiatan, bidang] = await Promise.all([ambilKegiatan(), ambilBidang()]);
    return { kegiatan, bidang };
  },
  component: KegiatanPage,
});

const STATUS_LABEL: Record<KegiatanTahap, { label: string; tone: string }> = {
  rencana: { label: "Rencana", tone: "bg-warning/10 text-warning" },
  berjalan: { label: "Berjalan", tone: "bg-success/10 text-success" },
  selesai: { label: "Selesai", tone: "bg-primary/10 text-primary" },
  batal: { label: "Batal", tone: "bg-muted-surface text-ink-muted" },
};

function KegiatanPage() {
  const { periodeAktif } = useSitus();
  const { kegiatan, bidang: daftarBidang } = Route.useLoaderData();
  const namaBidang = Object.fromEntries(daftarBidang.map((b) => [b.slug, b.singkat]));
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const status = search.status ?? "semua";
  const bidang = search.bidang;

  const filtered = useMemo(
    () =>
      kegiatan.filter(
        (k) => (status === "semua" || k.tahap === status) && cocokBidang(k.bidang, bidang),
      ),
    [kegiatan, status, bidang],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow={periodeAktif ? `Periode ${periodeAktif.label}` : "Karang Taruna RW 03"}
        title="Kegiatan Karang Taruna RW 03"
        description="Garis waktu kegiatan resmi — gunakan filter di bawah untuk menelusuri."
      />

      {/* Filter */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-6">
          <div className="grid min-w-0 gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Status
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["semua", "rencana", "berjalan", "selesai", "batal"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() =>
                      void navigate({
                        search: (lama) => ({ ...lama, status: s === "semua" ? undefined : s }),
                        resetScroll: false,
                      })
                    }
                    className={`min-h-11 rounded-full border px-3 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                      status === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface text-ink hover:border-primary/40"
                    }`}
                  >
                    {s === "semua" ? "Semua" : STATUS_LABEL[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-w-0 lg:border-l lg:border-border lg:pl-6">
              <FilterBidang
                bidang={daftarBidang}
                nilai={bidang}
                onChange={(nilai) =>
                  void navigate({
                    search: (lama) => ({ ...lama, bidang: nilai }),
                    resetScroll: false,
                  })
                }
              />
            </div>
            <p aria-live="polite" className="text-xs text-ink-muted tabular-nums">
              {filtered.length} kegiatan
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <ol className="relative space-y-6 border-l-2 border-border pl-6">
              {filtered.map((k) => (
                <li key={k.id} className="relative">
                  <span className="absolute -left-[31px] top-2 grid size-4 place-items-center rounded-full border-2 border-background bg-primary" />
                  <KartuAgenda kegiatan={k} namaBidang={k.bidang ? namaBidang[k.bidang] : null} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
      <p className="font-heading text-base font-semibold text-ink">Tidak ada kegiatan</p>
      <p className="mt-1 text-sm text-ink-muted">Coba ubah filter atau periksa kembali nanti.</p>
    </div>
  );
}
