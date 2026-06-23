import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { KEGIATAN_LIST, type KegiatanStatus } from "@/domains/kegiatan/data";
import { BIDANG_LIST, BIDANG_BY_SLUG, type BidangSlug } from "@/domains/program/data";

export const Route = createFileRoute("/admin/kegiatan")({ component: Page });

const STATUS_TONE: Record<KegiatanStatus, string> = {
  rencana:  "bg-warning/10 text-warning border-warning/20",
  berjalan: "bg-primary/10 text-primary border-primary/20",
  selesai:  "bg-success/10 text-success border-success/20",
};
const STATUS_LABEL: Record<KegiatanStatus, string> = {
  rencana: "Rencana", berjalan: "Berjalan", selesai: "Selesai",
};

function Page() {
  const [status, setStatus] = useState<"semua" | KegiatanStatus>("semua");
  const [bidang, setBidang] = useState<"semua" | BidangSlug>("semua");

  const items = KEGIATAN_LIST.filter(
    (k) =>
      (status === "semua" || k.status === status) &&
      (bidang === "semua" || k.bidang === bidang),
  );

  return (
    <AdminShell
      title="Kegiatan"
      description="Timeline rencana, kegiatan berjalan, dan kegiatan selesai per bidang."
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
          <Plus className="size-4" /> Tambah Kegiatan
        </button>
      }
    >
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-tile lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Pill active={status === "semua"} onClick={() => setStatus("semua")}>Semua Status</Pill>
          {(Object.keys(STATUS_LABEL) as KegiatanStatus[]).map((s) => (
            <Pill key={s} active={status === s} onClick={() => setStatus(s)}>
              {STATUS_LABEL[s]}
            </Pill>
          ))}
        </div>
        <select
          value={bidang}
          onChange={(e) => setBidang(e.target.value as "semua" | BidangSlug)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
        >
          <option value="semua">Semua Bidang</option>
          {BIDANG_LIST.map((b) => (
            <option key={b.slug} value={b.slug}>{b.short}</option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={CalendarRange} title="Tidak ada kegiatan" description="Atur ulang filter di atas." />
      ) : (
        <ol className="relative space-y-4 border-l-2 border-border pl-5">
          {items.map((k, i) => {
            const b = BIDANG_BY_SLUG[k.bidang];
            return (
              <li
                key={k.id}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="absolute -left-[27px] top-3 grid size-4 place-items-center rounded-full border-2 border-surface bg-primary" />
                <article className="rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:shadow-tile-hover">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_TONE[k.status]}`}>
                      {STATUS_LABEL[k.status]}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {b.short.split(" ")[0]}
                    </span>
                    <span className="ml-auto text-[11px] tabular-nums text-ink-muted">{k.tanggal}</span>
                  </div>
                  <h3 className="mt-2 font-heading text-base font-semibold text-ink leading-snug">{k.judul}</h3>
                  <p className="mt-1 text-sm text-ink-muted line-clamp-2">{k.ringkasan}</p>
                  <p className="mt-2 text-[11px] text-ink-muted">📍 {k.lokasi}</p>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </AdminShell>
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