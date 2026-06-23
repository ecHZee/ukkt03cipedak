import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileText, Plus, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  DOKUMEN_LIST, DOKUMEN_KATEGORI_LABEL, type DokumenKategori, type DokumenStatus,
} from "@/domains/dokumen/data";

export const Route = createFileRoute("/admin/dokumen")({ component: Page });

const STATUS_TONE: Record<DokumenStatus, string> = {
  publik:   "bg-success/10 text-success",
  internal: "bg-primary/10 text-primary",
  draft:    "bg-muted-surface text-ink-muted",
};

function Page() {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState<"semua" | DokumenKategori>("semua");

  const items = DOKUMEN_LIST.filter(
    (d) =>
      (kat === "semua" || d.kategori === kat) &&
      (q.trim() === "" || d.judul.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <AdminShell
      title="Dokumen"
      description="Kelola arsip LPJ, Proposal, SK, Surat Masuk & Keluar."
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
          <Plus className="size-4" /> Unggah Dokumen
        </button>
      }
    >
      <div className="mb-5 rounded-xl border border-border bg-surface p-4 shadow-tile">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama dokumen…"
              className="h-10 w-full rounded-lg border border-border bg-muted-surface pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={kat}
            onChange={(e) => setKat(e.target.value as "semua" | DokumenKategori)}
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
          >
            <option value="semua">Semua Kategori</option>
            {(Object.keys(DOKUMEN_KATEGORI_LABEL) as DokumenKategori[]).map((k) => (
              <option key={k} value={k}>{DOKUMEN_KATEGORI_LABEL[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={FileText} title="Tidak ada dokumen" description="Coba kata kunci lain." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted-surface text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((d) => (
                  <tr key={d.id} className="transition hover:bg-muted-surface/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-4" />
                        </div>
                        <span className="font-semibold text-ink line-clamp-1">{d.judul}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink">{DOKUMEN_KATEGORI_LABEL[d.kategori]}</td>
                    <td className="px-4 py-3 tabular-nums text-ink-muted">{d.tanggal} · {d.ukuran}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_TONE[d.status]}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">
                        <Eye className="size-3.5" /> Pratinjau
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}