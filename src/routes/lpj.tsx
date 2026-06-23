import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileText, Search, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  DOKUMEN_LIST, DOKUMEN_KATEGORI_LABEL, type DokumenKategori, type DokumenStatus,
} from "@/domains/dokumen/data";

export const Route = createFileRoute("/lpj")({ component: Page });

const STATUS_TONE: Record<DokumenStatus, string> = {
  publik:   "bg-success/10 text-success border-success/20",
  internal: "bg-primary/10 text-primary border-primary/20",
  draft:    "bg-muted-surface text-ink-muted border-border",
};

function Page() {
  const [q, setQ] = useState("");
  const [tahun, setTahun] = useState<"semua" | number>("semua");
  const [kat, setKat] = useState<"semua" | DokumenKategori>("semua");

  const tahunList = useMemo(
    () => Array.from(new Set(DOKUMEN_LIST.map((d) => d.tahun))).sort((a, b) => b - a),
    [],
  );
  const filtered = DOKUMEN_LIST.filter(
    (d) =>
      (tahun === "semua" || d.tahun === tahun) &&
      (kat === "semua" || d.kategori === kat) &&
      (q.trim() === "" || d.judul.toLowerCase().includes(q.toLowerCase())),
  );

  const published = DOKUMEN_LIST.filter((d) => d.status === "publik").length;
  const draft = DOKUMEN_LIST.filter((d) => d.status === "draft").length;

  return (
    <PageShell>
      <PageHero
        eyebrow="Transparansi Organisasi"
        title="Laporan Pertanggungjawaban & Dokumen Resmi."
        description="Arsip publik LPJ Kegiatan, Proposal, SK Organisasi, serta surat resmi Karang Taruna RW 03 Cipedak."
      >
        <div className="flex flex-wrap gap-3 text-sm text-white/85">
          <Stat label="Total Dokumen" value={DOKUMEN_LIST.length} />
          <Stat label="Dipublikasikan" value={published} />
          <Stat label="Dalam Penyusunan" value={draft} />
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12 space-y-6">
        {/* Toolbar */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-tile md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama dokumen…"
                className="h-10 w-full rounded-lg border border-border bg-muted-surface pl-9 pr-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill active={tahun === "semua"} onClick={() => setTahun("semua")}>Semua Tahun</Pill>
              {tahunList.map((t) => (
                <Pill key={t} active={tahun === t} onClick={() => setTahun(t)}>{t}</Pill>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill active={kat === "semua"} onClick={() => setKat("semua")}>Semua Kategori</Pill>
            {(Object.keys(DOKUMEN_KATEGORI_LABEL) as DokumenKategori[]).map((k) => (
              <Pill key={k} active={kat === k} onClick={() => setKat(k)}>
                {DOKUMEN_KATEGORI_LABEL[k]}
              </Pill>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Tidak ada dokumen yang cocok"
            description="Coba ganti kata kunci atau hapus filter aktif."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, idx) => (
              <article
                key={d.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:shadow-tile-hover hover:border-primary/30 animate-fade-in-up"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                        {DOKUMEN_KATEGORI_LABEL[d.kategori]}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_TONE[d.status]}`}>
                        {d.status}
                      </span>
                    </div>
                    <h3 className="mt-1 font-heading text-[15px] font-semibold text-ink leading-snug line-clamp-2">
                      {d.judul}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted tabular-nums">
                      {d.tanggal} · {d.ukuran} · PDF
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex gap-2">
                  <button
                    type="button"
                    disabled={d.placeholder}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-muted-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-50"
                  >
                    <Eye className="size-3.5" /> Pratinjau
                  </button>
                  <button
                    type="button"
                    disabled={d.placeholder}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Download className="size-3.5" /> Unduh
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-muted-surface p-5 text-sm text-ink-muted">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
            <p>
              Seluruh dokumen yang berstatus <strong className="text-ink">publik</strong> dapat diunduh oleh warga.
              Dokumen berstatus <strong className="text-ink">internal</strong> hanya dapat diakses oleh pengurus.
            </p>
          </div>
        </div>
      </section>
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
