import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { useSitus } from "@/hooks/use-situs";
import type { KegiatanTahap } from "@/domains/konten/types";
import { ambilKegiatan } from "@/services/konten";
import { ambilBidang } from "@/services/organisasi";

export const Route = createFileRoute("/kegiatan")({
  head: () => ({
    meta: [
      { title: "Kegiatan — Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Timeline kegiatan Karang Taruna RW 03 Cipedak — rencana, sedang berjalan, dan yang sudah selesai.",
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
  const [status, setStatus] = useState<KegiatanTahap | "semua">("semua");
  const [bidang, setBidang] = useState<string>("semua");

  const filtered = useMemo(
    () =>
      kegiatan.filter(
        (k) =>
          (status === "semua" || k.tahap === status) && (bidang === "semua" || k.bidang === bidang),
      ),
    [kegiatan, status, bidang],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow={periodeAktif ? `Periode ${periodeAktif.label}` : "Karang Taruna RW 03"}
        title="Kegiatan Karang Taruna RW 03"
        description="Garis waktu kegiatan resmi — gunakan filter di bawah untuk menelusuri."
        variant="light"
      />

      {/* Filter */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-6">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Status
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["semua", "rencana", "berjalan", "selesai"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
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
            <div className="lg:border-l lg:border-border lg:pl-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Kategori (Bidang)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <FilterChip active={bidang === "semua"} onClick={() => setBidang("semua")}>
                  Semua
                </FilterChip>
                {daftarBidang.map((b) => (
                  <FilterChip
                    key={b.slug}
                    active={bidang === b.slug}
                    onClick={() => setBidang(b.slug)}
                  >
                    {b.singkat}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div className="text-xs text-ink-muted tabular-nums">{filtered.length} kegiatan</div>
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
              {filtered.map((k) => {
                const nama = k.bidang ? namaBidang[k.bidang] : null;
                const status = STATUS_LABEL[k.tahap];
                return (
                  <li key={k.id} className="relative">
                    <span className="absolute -left-[31px] top-2 grid size-4 place-items-center rounded-full border-2 border-background bg-primary" />
                    <article className="rounded-xl border border-border bg-surface p-5 shadow-tile">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                        <span className={`rounded-full px-2.5 py-0.5 ${status.tone}`}>
                          {status.label}
                        </span>
                        {nama && (
                          <span className="rounded-full bg-muted-surface px-2.5 py-0.5 text-ink-muted">
                            {nama}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-heading text-lg font-bold text-ink leading-snug">
                        {k.judul}
                      </h3>
                      {k.ringkasan && (
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed">{k.ringkasan}</p>
                      )}
                      {(k.jadwal || k.lokasi) && (
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-muted">
                          {k.jadwal && (
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-3.5 text-primary" />
                              <span className="tabular-nums">{k.jadwal}</span>
                            </span>
                          )}
                          {k.lokasi && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-primary" />
                              {k.lokasi}
                            </span>
                          )}
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function FilterChip({
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

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
      <p className="font-heading text-base font-semibold text-ink">Tidak ada kegiatan</p>
      <p className="mt-1 text-sm text-ink-muted">Coba ubah filter atau periksa kembali nanti.</p>
    </div>
  );
}
